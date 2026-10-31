import image from '@/assets/login-img.png';
import logo from '@/assets/logo.png';

const LoginPhotoPanel = () => {
    return (
        <div className="hidden md:flex md:w-1/2 bg-card p-5">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <img
                    src={image}
                    alt="Nexora"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/95" />
                {/* Logo badge */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                      <img src={logo} alt="Logo" className="w-16 h-16 bg-white rounded-md " />
                </div>
                {/* Headline + copy */}
                <div className="absolute bottom-0 inset-x-0 p-8">
                    <h2 className="text-2xl font-bold text-white mb-3 leading-snug">
                        لوحة تحكم قوية ومرنة
                    </h2>
                    <p className="text-white/85 text-sm md:text-md leading-relaxed mb-6">
                        أدِر نظامك بكفاءة من خلال لوحة تحكم حديثة توفر لك كل الأدوات التي تحتاجها.
                    </p>
                    <div className="border-t border-white/20 pt-4 text-center mt-10 ">
                        <p className="text-white/70 text-sm md:text-md leading-relaxed">
                            نظام آمن وموثوق لإدارة أعمالك
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPhotoPanel;
