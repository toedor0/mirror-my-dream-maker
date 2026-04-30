import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/cerez")({
  head: () => ({
    meta: [
      { title: "Çerez Politikası — Çift Dikiş" },
      { name: "description", content: "Çift Dikiş'te kullanılan çerezler, türleri ve tercihlerinizi nasıl yöneteceğiniz." },
      { property: "og:title", content: "Çerez Politikası — Çift Dikiş" },
      { property: "og:description", content: "Çerez kullanımımız ve tercih yönetimi hakkında bilgi." },
    ],
  }),
  component: CerezPage,
});

function CerezPage() {
  return (
    <LegalLayout title="Çerez Politikası" subtitle="Son güncelleme: Nisan 2026">
      <h2>1. Çerez Nedir?</h2>
      <p>Çerez (cookie), bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler; oturum bilgilerini hatırlamak, tercihlerinizi kaydetmek ve kullanım istatistikleri oluşturmak gibi çeşitli amaçlarla kullanılır.</p>

      <h2>2. Kullandığımız Çerez Türleri</h2>
      <h3>2.1. Zorunlu Çerezler</h3>
      <p>Bu çerezler platformun temel işlevlerini yerine getirebilmesi için gereklidir. Oturum açma, güvenlik ve sayfa gezinmesi bu çerezlere bağlıdır. Devre dışı bırakılamazlar; devre dışı bırakılmaları halinde platform düzgün çalışmaz.</p>
      <h3>2.2. İşlevsel Çerezler</h3>
      <p>Dil, tema (açık/koyu mod) ve kullanıcı arayüzü tercihleri gibi seçimlerinizi hatırlayan çerezlerdir. Bu çerezler olmadan platformu her ziyaretinizde tercihlerinizi yeniden ayarlamanız gerekir.</p>
      <h3>2.3. Analitik Çerezler</h3>
      <p>Hangi sayfaların ne kadar ziyaret edildiğini, hangi içeriklerin daha çok ilgi gördüğünü ve kullanıcıların platformda nasıl gezindiğini ölçen çerezlerdir. Bu veriler anonimleştirilmiş biçimde platform geliştirme amacıyla kullanılır.</p>
      <p>Analitik çerezlere yönelik Google Analytics hizmeti kullanılmaktadır. Google'ın veri işleme politikasına <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">policies.google.com/privacy</a> adresinden ulaşabilirsiniz.</p>
      <h3>2.4. Pazarlama / Hedefleme Çerezleri</h3>
      <p>İlgi alanlarınıza uygun içerik veya reklamların gösterilmesi amacıyla kullanılan çerezlerdir. Bu çerezler yalnızca açık rızanız alındıktan sonra etkinleştirilir. Mevcut durumda Platform, üçüncü taraf reklam ağı çerezleri kullanmamaktadır; ancak bu durum ileride değişebilir ve değişiklik öncesinde rızanız yeniden alınır.</p>

      <h2>3. Kullandığımız Çerezlerin Listesi</h2>
      <table>
        <thead>
          <tr>
            <th>Çerez Adı</th>
            <th>Türü</th>
            <th>Amaç</th>
            <th>Saklama Süresi</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>session_id</td><td>Zorunlu</td><td>Oturum yönetimi</td><td>Oturum sonu</td></tr>
          <tr><td>csrf_token</td><td>Zorunlu</td><td>Güvenlik (CSRF koruması)</td><td>Oturum sonu</td></tr>
          <tr><td>user_prefs</td><td>İşlevsel</td><td>Dil ve tema tercihleri</td><td>1 yıl</td></tr>
          <tr><td>_ga, _gid</td><td>Analitik</td><td>Google Analytics — kullanım istatistiği</td><td>2 yıl / 24 saat</td></tr>
          <tr><td>consent</td><td>Zorunlu</td><td>Çerez rızası kaydı</td><td>1 yıl</td></tr>
        </tbody>
      </table>

      <h2>4. Çerez Tercihlerinizi Yönetme</h2>
      <h3>4.1. Çerez Onay Paneli</h3>
      <p>Platforma ilk girişinizde sunulan çerez onay penceresinden zorunlu çerezler dışındaki tüm çerezleri kabul veya reddedebilirsiniz. Tercihlerinizi daha sonra değiştirmek için sayfanın alt kısmındaki "Çerez Tercihleri" bağlantısını kullanabilirsiniz.</p>
      <h3>4.2. Tarayıcı Ayarları</h3>
      <ul>
        <li><strong>Google Chrome:</strong> Ayarlar &gt; Gizlilik ve güvenlik &gt; Çerezler ve diğer site verileri</li>
        <li><strong>Mozilla Firefox:</strong> Ayarlar &gt; Gizlilik ve Güvenlik &gt; Çerezler ve Site Verileri</li>
        <li><strong>Safari:</strong> Tercihler &gt; Gizlilik &gt; Çerezler ve web sitesi verilerini yönet</li>
        <li><strong>Microsoft Edge:</strong> Ayarlar &gt; Çerezler ve site izinleri &gt; Çerezleri ve site verilerini yönet</li>
      </ul>
      <p>Tüm çerezleri tarayıcıdan devre dışı bırakmak, platformun bazı işlevlerinin düzgün çalışmamasına neden olabilir.</p>
      <h3>4.3. Analitik Opt-Out</h3>
      <p>Google Analytics'ten çıkmak için: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">tools.google.com/dlpage/gaoptout</a> adresindeki tarayıcı eklentisini kullanabilirsiniz.</p>

      <h2>5. Çerez Olmayan İzleme Teknolojileri</h2>
      <ul>
        <li><strong>Yerel depolama (localStorage):</strong> Tarayıcı kapatılmadan korunan tercih verileri</li>
        <li><strong>Oturum depolaması (sessionStorage):</strong> Tarayıcı kapanınca silinen geçici veriler</li>
        <li><strong>Log dosyaları:</strong> Sunucu kayıtları (IP adresi, erişim zamanı, sayfa — en fazla 90 gün)</li>
      </ul>

      <h2>6. Üçüncü Taraf Çerezleri</h2>
      <p>Entegre ettiğimiz bazı üçüncü taraf hizmetler kendi çerezlerini yerleştirebilir. Bu çerezler ilgili üçüncü tarafın gizlilik politikasına tabidir ve Platform bu çerezler üzerinde doğrudan kontrol sahibi değildir.</p>
      <p>Mevcut üçüncü taraf entegrasyonları:</p>
      <ul>
        <li>Google Analytics (analitik)</li>
      </ul>

      <h2>7. Politika Değişiklikleri</h2>
      <p>Bu Çerez Politikası, kullandığımız hizmetlerdeki değişiklikler veya yasal gereklilikler doğrultusunda güncellenebilir. Önemli değişiklikler platform üzerinden duyurulur.</p>

      <h2>8. İletişim</h2>
      <p>Çerez uygulamalarımıza ilişkin sorularınız için: noreply@ciftdikis.com</p>
    </LegalLayout>
  );
}
