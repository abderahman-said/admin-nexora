export function LoginHeader() {
  return (
    <div className="mb-8 text-start space-y-2">
      <div className="h-10 w-10 rounded-2xl bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center font-bold text-lg md:hidden mb-4 shadow-2xs">
        N
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        تسجيل الدخول
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        أدخل بيانات حسابك للوصول إلى لوحة التحكم الإدارية.
      </p>
    </div>
  );
}
