export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground">جاري العمل على هذا القسم وسيتم الانتهاء منه قريباً.</p>
    </div>
  );
}
