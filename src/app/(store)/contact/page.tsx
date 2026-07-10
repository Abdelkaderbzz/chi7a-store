import { STORE_INFO } from "@/lib/constants";
import { Phone, MapPin, MessageCircle, Clock, Globe, Navigation } from "lucide-react";

export const metadata = { title: "اتصل بنا" };

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">اتصل بنا</h1>
      <p className="text-muted mb-10">{STORE_INFO.welcome}</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-gold/10 p-3 rounded-lg">
                <MapPin className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">العنوان</h3>
                <p className="text-muted mb-2">{STORE_INFO.location}</p>
                <a
                  href={STORE_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-gold-dark hover:underline font-medium"
                >
                  <Navigation size={14} />
                  احصل على الاتجاهات عبر خرائط Google
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-gold/10 p-3 rounded-lg">
                <Phone className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">الهاتف</h3>
                <a href={`tel:${STORE_INFO.phone}`} className="text-gold-dark hover:underline text-lg font-medium">
                  {STORE_INFO.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-gold/10 p-3 rounded-lg">
                <MessageCircle className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">واتساب</h3>
                <a
                  href={STORE_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  راسلنا على واتساب
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-gold/10 p-3 rounded-lg">
                <Globe className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">فيسبوك</h3>
                <a
                  href={STORE_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Chi7a Store على Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gold/5 rounded-2xl border border-gold/20 p-8">
          <h2 className="text-xl font-bold mb-4 text-gold-dark">{STORE_INFO.slogan}</h2>
          <p className="text-muted leading-relaxed mb-6">
            نحن في Chi7a Store نقدم لكم أفضل المنتجات من الآيفون والأندرويد
            والأجهزة اللوحية والإكسسوارات بأفضل الأسعار في منطقة دوز وجنوب تونس.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Clock size={16} />
            <span>نحن في خدمتكم دائماً</span>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={STORE_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <MapPin size={18} />
              موقعنا على الخريطة
            </a>
            <a
              href={STORE_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <MessageCircle size={18} />
              تواصل عبر واتساب
            </a>
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="flex items-center justify-center gap-2 bg-gold text-white px-6 py-3 rounded-lg hover:bg-gold-dark transition-colors font-medium"
            >
              <Phone size={18} />
              {STORE_INFO.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">موقع المحل</h2>
          <a
            href={STORE_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gold-dark hover:underline flex items-center gap-1"
          >
            <Navigation size={14} />
            فتح في Google Maps
          </a>
        </div>
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            src={STORE_INFO.mapsEmbedUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="موقع Chi7a Store على الخريطة"
            className="w-full"
          />
        </div>
      </section>
    </div>
  );
}
