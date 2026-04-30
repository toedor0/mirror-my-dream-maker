import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/kvkk")({
  head: () => ({
    meta: [
      { title: "KVKK Aydınlatma Metni — Çift Dikiş" },
      { name: "description", content: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında hazırlanmış aydınlatma metni." },
      { property: "og:title", content: "KVKK Aydınlatma Metni — Çift Dikiş" },
      { property: "og:description", content: "Kişisel verilerinizin işlenmesine ilişkin aydınlatma metni." },
    ],
  }),
  component: KvkkPage,
});

function KvkkPage() {
  return (
    <LegalLayout title="KVKK Aydınlatma Metni" subtitle="Kişisel Verilerin Korunması Kanunu Kapsamında">
      <h2>1. Veri Sorumlusunun Kimliği</h2>
      <p>Bu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla Çift Dikiş tarafından hazırlanmıştır.</p>
      <p>
        <strong>İletişim bilgileri:</strong><br />
        Unvan: Çift Dikiş<br />
        Adres: Emek 15. Cadde Çankaya/Ankara<br />
        E-posta: noreply@ciftdikis.com<br />
        Web: www.ciftdikis.com
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <h3>2.1. Kimlik ve İletişim Verileri</h3>
      <ul>
        <li>Ad ve soyad</li>
        <li>E-posta adresi</li>
        <li>Kullanıcı adı (nickname)</li>
        <li>Profil fotoğrafı (isteğe bağlı)</li>
        <li>Doğum tarihi (yaş doğrulama amacıyla)</li>
      </ul>
      <h3>2.2. Kullanım ve Teknik Veriler</h3>
      <ul>
        <li>IP adresi ve konum bilgisi</li>
        <li>Cihaz türü, işletim sistemi ve tarayıcı bilgisi</li>
        <li>Platformda gerçekleştirilen eylemler (paylaşım, yorum, beğeni)</li>
        <li>Oturum açma tarihi ve saati</li>
        <li>Çerezler aracılığıyla elde edilen veriler</li>
      </ul>
      <h3>2.3. İçerik Verileri</h3>
      <ul>
        <li>Kullanıcı tarafından paylaşılan forum gönderileri, yorumlar ve mesajlar</li>
        <li>Yüklenen dosya, fotoğraf veya medya içerikleri</li>
        <li>Özel mesajlaşma içerikleri (uygulanabilirse)</li>
      </ul>

      <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <ul>
        <li>Üyelik hesabının oluşturulması, yönetimi ve kimlik doğrulama</li>
        <li>Platform hizmetlerinin sunulması ve kullanıcı deneyiminin iyileştirilmesi</li>
        <li>Topluluk kurallarının uygulanması ve moderasyon faaliyetleri</li>
        <li>Bildirim, duyuru ve hizmet içi iletişimlerin gönderilmesi</li>
        <li>Teknik sorunların tespiti ve güvenlik önlemlerinin alınması</li>
        <li>İstatistiksel analiz ve platform performansının ölçülmesi</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
        <li>İlgili mevzuat kapsamında yetkili kurum ve kuruluşlara bilgi verilmesi</li>
      </ul>

      <h2>4. Kişisel Verilerin İşlenmesinin Hukuki Sebepleri</h2>
      <ul>
        <li><strong>Açık rıza</strong> (KVKK m. 5/1): Reklam, pazarlama ve kişiselleştirme faaliyetleri</li>
        <li><strong>Sözleşmenin ifası</strong> (KVKK m. 5/2-c): Üyelik sözleşmesinin kurulması ve yürütülmesi</li>
        <li><strong>Hukuki yükümlülük</strong> (KVKK m. 5/2-ç): Yasal mevzuattan kaynaklanan yükümlülükler</li>
        <li><strong>Meşru menfaat</strong> (KVKK m. 5/2-f): Platform güvenliği ve hizmet kalitesinin korunması</li>
      </ul>

      <h2>5. Kişisel Verilerin Aktarılması</h2>
      <p>Kişisel verileriniz, KVKK'nın 8. ve 9. maddeleri uyarınca aşağıdaki taraflarla paylaşılabilir:</p>
      <ul>
        <li>Sunucu ve altyapı hizmetleri sağlayıcıları (barındırma, CDN, e-posta servisleri)</li>
        <li>Ödeme altyapısı sağlayıcıları (premium üyelik söz konusuysa)</li>
        <li>Analitik ve istatistik hizmet sağlayıcıları</li>
        <li>Yasal zorunluluk halinde mahkemeler, savcılıklar ve yetkili kamu kurumları</li>
        <li>Platform politikalarının ihlali durumunda ilgili kolluk birimleri</li>
      </ul>
      <p>Yurt dışı aktarım söz konusu olduğunda KVKK m. 9 kapsamındaki güvenceler (yeterli koruma veya açık rıza) sağlanmaktadır.</p>

      <h2>6. Kişisel Verilerin Saklanma Süresi</h2>
      <ul>
        <li>Üyelik süresince ve üyeliğin sonlanmasından itibaren 3 yıl (olası uyuşmazlıklar için)</li>
        <li>Yasal zorunluluk gerektiren veriler ilgili mevzuatta belirtilen süreler boyunca</li>
        <li>İçerik verileri hesap silindiğinde derhal anonimleştirilir veya imha edilir</li>
        <li>Teknik/log verileri en fazla 2 yıl süreyle saklanır</li>
      </ul>

      <h2>7. Çerez (Cookie) Kullanımı</h2>
      <ul>
        <li><strong>Zorunlu çerezler:</strong> Oturum yönetimi ve güvenlik için kullanılır, devre dışı bırakılamaz.</li>
        <li><strong>İşlevsel çerezler:</strong> Dil ve tema tercihleri gibi kullanıcı ayarlarını hatırlar.</li>
        <li><strong>Analitik çerezler:</strong> Platform kullanım istatistiklerini toplar (Google Analytics vb.).</li>
        <li><strong>Pazarlama çerezleri:</strong> Yalnızca açık rızanız doğrultusunda kullanılır.</li>
      </ul>
      <p>Daha fazla bilgi için <a href="/cerez">Çerez Politikamıza</a> bakınız.</p>

      <h2>8. İlgili Kişinin Hakları (KVKK m. 11)</h2>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
        <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
        <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
        <li>KVKK m. 7'de öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
        <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
        <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
      </ul>

      <h2>9. Haklarınızı Kullanmak İçin Başvuru Yöntemi</h2>
      <ul>
        <li>E-posta: noreply@ciftdikis.com (konu satırına 'KVKK Başvurusu' yazınız)</li>
        <li>Posta: Şirket adresine ıslak imzalı dilekçeyle</li>
      </ul>
      <p>Başvurularınız, kimliğinizin doğrulanmasının ardından KVKK m. 13 uyarınca en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır. İşlemin ayrıca bir maliyet gerektirmesi halinde Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifeye göre ücret talep edilebilir.</p>

      <h2>10. Kişisel Verileri Koruma Kurulu'na Başvuru Hakkı</h2>
      <p>Başvurunuzun reddedilmesi, verilen yanıtı yetersiz bulmanız veya süresinde yanıt verilmemesi halinde Kişisel Verileri Koruma Kurulu'na şikâyette bulunma hakkınız saklıdır.</p>
      <p><strong>Kişisel Verileri Koruma Kurumu:</strong> <a href="https://www.kvkk.gov.tr" target="_blank" rel="noreferrer">www.kvkk.gov.tr</a></p>

      <h2>11. Aydınlatma Metninde Değişiklikler</h2>
      <p>Platform, bu Aydınlatma Metni'ni mevzuat değişiklikleri veya hizmet güncellemeleri doğrultusunda güncelleme hakkını saklı tutar. Güncel metin her zaman platform ana sayfasının alt kısmında erişilebilir biçimde yer alır. Önemli değişiklikler e-posta veya platform bildirimi aracılığıyla kullanıcılara duyurulur.</p>
    </LegalLayout>
  );
}
