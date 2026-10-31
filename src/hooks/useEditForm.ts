import { useEffect, useRef, useMemo, useCallback } from 'react';
import {
  useForm,
  UseFormProps,
  FieldValues,
  UseFormReturn,
  DefaultValues,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { getDirtyValues, hasFormChanges } from '@/lib/dirtyValues';

export interface UseEditFormOptions<T extends FieldValues> {
  defaultValues: T;
  data?: T | null;
  files?: Record<string, File | null | undefined>;
  onSubmit: (dirtyData: Partial<T>, allData: T) => Promise<unknown> | void;
  formOptions?: Omit<UseFormProps<T>, 'defaultValues'>;
  noChangesMessage?: string;
  isEdit?: boolean;
}

export interface UseEditFormReturn<T extends FieldValues> {
  form: UseFormReturn<T>;
  isDirty: boolean;
  hasChanges: boolean;
  dirtyValues: Partial<T>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  resetWithData: (data: T) => void;
  getDirtyPayload: () => Partial<T>;
}

/**
 * Reusable hook for Edit forms to guarantee:
 * 1. Initialized with existing record via reset(data) so dirty state is calibrated.
 * 2. Only changed fields (dirty values) are computed and sent.
 * 3. Compares by value: changes reverted to original values are ignored.
 * 4. If nothing changed, NO request is dispatched; an info toast is shown.
 * 5. Button disable state is easily derived from !hasChanges.
 * 6. After successful update, resets with new data to cleanly reset dirty state.
 */
export function useEditForm<T extends FieldValues>({
  defaultValues,
  data,
  files,
  onSubmit,
  formOptions,
  noChangesMessage = 'لا توجد تعديلات للحفظ',
  isEdit = true,
}: UseEditFormOptions<T>): UseEditFormReturn<T> {
  const originalValuesRef = useRef<T | undefined>(data || undefined);

  const form = useForm<T>({
    mode: 'onChange',
    defaultValues: defaultValues as DefaultValues<T>,
    ...formOptions,
  });

  const {
    handleSubmit: formHandleSubmit,
    reset,
    formState: { dirtyFields },
    watch,
  } = form;

  // Track all values reactively to recalculate dirty values
  const watchedValues = watch();

  // Reset form when external record data loads or changes
  useEffect(() => {
    if (data) {
      originalValuesRef.current = data;
      reset(data as DefaultValues<T>);
    }
  }, [data, reset]);

  const resetWithData = useCallback(
    (newData: T) => {
      originalValuesRef.current = newData;
      reset(newData as DefaultValues<T>);
    },
    [reset]
  );

  const getDirtyPayload = useCallback((): Partial<T> => {
    return getDirtyValues(dirtyFields, form.getValues(), originalValuesRef.current);
  }, [dirtyFields, form]);

  const dirtyValues = useMemo(() => {
    return getDirtyValues(dirtyFields, watchedValues as T, originalValuesRef.current);
  }, [dirtyFields, watchedValues]);

  // Check if there are real changes in fields or new files
  const hasChanges = useMemo(() => {
    // In create mode (isEdit === false), any form validity/presence is considered changes
    if (!isEdit) return true;
    return hasFormChanges(dirtyValues, files);
  }, [isEdit, dirtyValues, files]);

  const isDirty = hasChanges;

  const handleSubmit = formHandleSubmit(async (allValues) => {
    if (isEdit && !hasChanges) {
      toast(noChangesMessage, { icon: 'ℹ️' });
      return;
    }

    const payload = isEdit ? getDirtyPayload() : allValues;
    await onSubmit(payload, allValues);
  });

  return {
    form,
    isDirty,
    hasChanges,
    dirtyValues,
    handleSubmit,
    resetWithData,
    getDirtyPayload,
  };
}
