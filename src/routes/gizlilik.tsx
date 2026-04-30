import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/gizlilik")({
  head: () => ({
    meta: [
      { title: "Gizlilik Politikası — Çift Dikiş" },
      { name: "description", content: "Çift Dikiş platformunun kişisel verileri nasıl topladığını, kullandığını ve koruduğunu açıklayan gizlilik politikası." },
      { property: "og:title", content: "Gizlilik Politikası — Çift Dikiş" },
      { property: "og:description", content: "KVKK ve GDPR kapsamında hazırlanmış gizlilik politikamız." },
    ],
  }),
  component: GizlilikPage,
});

function GizlilikPage() {
  return (
    <LegalLayout title="Gizlilik Politikası" subtitle="Son güncelleme: Nisan 2026">
      <h2>1. Genel Bakış</h2>
      <p>Bu Gizlilik Politikası, Çift Dikiş platformunun ("Platform", "Biz") kullanıcılarına ("Siz") ait kişisel verileri nasıl topladığını, kullandığını, sakladığını ve koruduğunu açıklamaktadır.</p>
      <p>Bu Politika; 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK), Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR — AB üyesi veya EEA ülkelerinden erişen kullanıcılar için) ve ilgili ikincil mevzuat kapsamında hazırlanmıştır.</p>
      <p>Platformumuzu kullanarak bu Politikayı kabul etmiş sayılırsınız.</p>

      <h2>2. Veri Sorumlusu</h2>
      <p>
        <strong>Çift Dikiş</strong><br />
        Adres: Emek 15. Cadde Çankaya / Ankara<br />
        E-posta: noreply@ciftdikis.com<br />
        Web: www.ciftdikis.com
      </p>

      <h2>3. Topladığımız Veriler</h2>
      <h3>3.1. Doğrudan Sağladığınız Veriler</h3>
      <ul>
        <li>Ad, soyad ve kullanıcı adı</li>
        <li>E-posta adresi</li>
        <li>Profil fotoğrafı (isteğe bağlı)</li>
        <li>Biyografi/hakkımda metni (isteğe bağlı)</li>
        <li>Forum gönderileri, yorumlar, mesajlar ve yüklenen içerikler</li>
        <li>İletişim formları aracılığıyla gönderilen mesajlar</li>
      </ul>

      <h3>3.2. Otomatik Olarak Toplanan Veriler</h3>
      <ul>
        <li>IP adresi ve yaklaşık konum bilgisi (ülke/şehir düzeyinde)</li>
        <li>Tarayıcı türü, sürümü ve dil ayarı</li>
        <li>İşletim sistemi ve cihaz türü</li>
        <li>Platforma erişim tarihi, saati ve süresi</li>
        <li>Gezinilen sayfalar ve tıklanan bağlantılar</li>
        <li>Çerezler ve benzeri izleme teknolojileri aracılığıyla toplanan veriler</li>
        <li>Hata ve kilitlenme raporları</li>
      </ul>

      <h3>3.3. Üçüncü Taraflardan Alınan Veriler</h3>
      <ul>
        <li>Sosyal medya ile giriş yapılması halinde ilgili platformdan alınan profil bilgileri (ad, e-posta, profil görseli)</li>
        <li>Ödeme altyapı sağlayıcısından alınan işlem onayı (kart/banka bilgileri Platform tarafından saklanmaz)</li>
      </ul>

      <h2>4. Verilerin Kullanım Amaçları</h2>
      <h3>4.1. Hizmetin Sunulması</h3>
      <ul>
        <li>Hesap oluşturma, kimlik doğrulama ve oturum yönetimi</li>
        <li>Forum, yorum ve mesajlaşma özelliklerinin çalıştırılması</li>
        <li>Kullanıcıya özel bildirimler ve içerik önerileri</li>
        <li>Premium üyelik işlemlerinin gerçekleştirilmesi</li>
      </ul>
      <h3>4.2. Güvenlik ve Hukuki Yükümlülükler</h3>
      <ul>
        <li>Yetkisiz erişim, dolandırıcılık ve platform istismarının tespiti</li>
        <li>KVKK ve ilgili mevzuattan doğan yükümlülüklerin yerine getirilmesi</li>
        <li>Yetkili kurum ve kuruluşlara yasal bildirim yapılması</li>
      </ul>
      <h3>4.3. Geliştirme ve Analiz</h3>
      <ul>
        <li>Platform kullanım istatistiklerinin oluşturulması (anonimleştirilmiş)</li>
        <li>Kullanıcı deneyiminin iyileştirilmesi ve yeni özelliklerin geliştirilmesi</li>
        <li>Teknik hataların tespiti ve giderilmesi</li>
      </ul>
      <h3>4.4. Pazarlama (Yalnızca Rızayla)</h3>
      <ul>
        <li>Bülten ve kampanya e-postaları gönderilmesi</li>
        <li>Kişiselleştirilmiş içerik ve reklam gösterimi</li>
      </ul>
      <p>Pazarlama iletişimlerinden istediğiniz zaman e-postanın alt kısmındaki "Abonelikten Çık" bağlantısıyla veya iletisim@ciftdikis.com adresinden çıkabilirsiniz.</p>

      <h2>5. Hukuki Dayanak</h2>
      <ul>
        <li><strong>Sözleşmenin ifası</strong> (KVKK m.5/2-c | GDPR md.6/1-b): Üyelik hizmetinin sunulması</li>
        <li><strong>Hukuki yükümlülük</strong> (KVKK m.5/2-ç | GDPR md.6/1-c): Yasal bildirim ve arşivleme</li>
        <li><strong>Meşru menfaat</strong> (KVKK m.5/2-f | GDPR md.6/1-f): Platform güvenliği ve teknik iyileştirme</li>
        <li><strong>Açık rıza</strong> (KVKK m.5/1 | GDPR md.6/1-a): Pazarlama iletişimleri ve analitik çerezler</li>
      </ul>

      <h2>6. Veri Paylaşımı ve Aktarım</h2>
      <h3>6.1. Yurt İçi Aktarım</h3>
      <ul>
        <li>Altyapı ve barındırma hizmet sağlayıcıları</li>
        <li>E-posta ve bildirim sistemi sağlayıcıları</li>
        <li>Ödeme altyapısı sağlayıcıları</li>
        <li>Analitik ve istatistik hizmet sağlayıcıları</li>
        <li>Yasal zorunluluk halinde mahkemeler, savcılıklar ve yetkili kamu kurumları</li>
      </ul>
      <h3>6.2. Yurt Dışı Aktarım</h3>
      <p>Bazı teknik hizmetler (sunucu, analitik, e-posta) yurt dışı merkezli sağlayıcılar tarafından sunulabilir. Bu aktarımlar KVKK m.9 ve GDPR Bölüm V kapsamındaki güvenceler (standart sözleşme maddeleri veya yeterlilik kararı) çerçevesinde gerçekleştirilmektedir.</p>
      <p>Kullandığımız başlıca yurt dışı sağlayıcılar ve aktarım güvenceleri talep halinde kvkk@ciftdikis.com adresinden paylaşılmaktadır.</p>
      <h3>6.3. Satış Yasağı</h3>
      <p>Kişisel verileriniz hiçbir koşulda üçüncü taraflara satılmaz veya kiralanmaz.</p>

      <h2>7. Çerezler</h2>
      <p>Çerez kullanımına ilişkin ayrıntılı bilgi için ayrıca yayımladığımız <a href="/cerez">Çerez Politikası</a>'na başvurunuz.</p>

      <h2>8. Veri Güvenliği</h2>
      <ul>
        <li>Tüm veri iletimi HTTPS/TLS ile şifrelenmektedir.</li>
        <li>Parolalar tek yönlü hash algoritması (bcrypt) ile saklanmaktadır.</li>
        <li>Kişisel verilere erişim, ihtiyaç esasına göre sınırlandırılmış ve erişimler loglanmaktadır.</li>
        <li>Düzenli güvenlik testleri ve açık tarama çalışmaları yapılmaktadır.</li>
        <li>Veri ihlali gerçekleşmesi halinde KVKK ve GDPR kapsamındaki bildirim yükümlülükleri yerine getirilir.</li>
      </ul>

      <h2>9. Saklama Süreleri</h2>
      <ul>
        <li>Aktif hesap verileri: Üyelik süresince ve hesap silme tarihinden itibaren 3 yıl</li>
        <li>Forum/yorum içerikleri: Hesap silindiğinde anonimleştirilir veya imha edilir</li>
        <li>Log ve teknik veriler: En fazla 2 yıl</li>
        <li>Ödeme kayıtları: 10 yıl (Türk Ticaret Kanunu uyarınca)</li>
        <li>Yasal zorunluluk gerektiren veriler: İlgili mevzuatta öngörülen süreler boyunca</li>
      </ul>

      <h2>10. Kullanıcı Hakları</h2>
      <h3>10.1. KVKK Kapsamında Haklarınız (Tüm Kullanıcılar)</h3>
      <ul>
        <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenen veriler hakkında bilgi talep etme</li>
        <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Yurt içinde veya dışında aktarıldığı üçüncü kişileri bilme</li>
        <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
        <li>Belirli koşullar altında silinmesini veya yok edilmesini isteme</li>
        <li>Otomatik sistemlerle alınan kararlara itiraz etme</li>
        <li>Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme</li>
      </ul>
      <h3>10.2. GDPR Kapsamında Ek Haklar (AB/EEA Kullanıcıları)</h3>
      <ul>
        <li>Veri taşınabilirliği hakkı (verilerinizi yapılandırılmış formatta alma)</li>
        <li>İşlemeyi kısıtlama hakkı</li>
        <li>Meşru menfaate dayalı işlemeye itiraz hakkı</li>
        <li>Denetim otoritesine şikayet hakkı (AB ülkenizdeki veri koruma otoritesi)</li>
      </ul>

      <h2>11. Haklarınızı Kullanma</h2>
      <p>Başvurularınız için:</p>
      <ul>
        <li>E-posta: noreply@ciftdikis.com (konu: KVKK/GDPR Başvurusu)</li>
        <li>Posta: Şirket adresi — ıslak imzalı dilekçeyle</li>
      </ul>
      <p>Kimliğiniz doğrulandıktan sonra başvurular en geç 30 gün (KVKK) / 1 ay (GDPR) içinde yanıtlanır. Denetim otoritelerine başvuru hakkınız saklıdır.</p>
      <ul>
        <li>KVKK için: Kişisel Verileri Koruma Kurumu — <a href="https://www.kvkk.gov.tr" target="_blank" rel="noreferrer">www.kvkk.gov.tr</a></li>
        <li>GDPR için: Ülkenizdeki yetkili veri koruma otoritesi</li>
      </ul>

      <h2>12. Çocukların Gizliliği</h2>
      <p>Platform, 13 yaşın altındaki kişilere yönelik hizmet sunmamaktadır. Bu yaş grubuna ait olduğunu fark ettiğimiz veriler derhal silinir. Çocuğunuza ait veri işlendiğini düşünüyorsanız lütfen kvkk@ciftdikis.com adresine bildirin.</p>

      <h2>13. Politika Değişiklikleri</h2>
      <p>Bu Politika gerektiğinde güncellenebilir. Önemli değişiklikler e-posta veya platform bildirimi ile duyurulur. Güncel metin her zaman sitemizin alt kısmında erişilebilir biçimde yer alır.</p>
    </LegalLayout>
  );
}
