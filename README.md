# Reddit Fırsat Radarı

Reddit kaynaklı iş, side-project ve micro-SaaS fikirlerini toplayan ve puanlayan kişisel web uygulaması.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/atpsec/reddit-job-idea)

## Özellikler
- 35 başlangıç fikri ve 7 kriterli ağırlıklı otomatik skor
- Canlı Akış: 18 subreddit RSS kaynağından fırsat sinyalleri
- 0-100 otomatik sinyal skoru
- Güçlü Reddit postunu tek tıkla fikir havuzuna dönüştürme
- Dashboard, Fikir Havuzu, Top 10 ve Kontrol Zamanı
- Arama, filtreleme ve sıralama
- Fikir ekleme/düzenleme
- Kaynak URL ve kontrol takvimi
- localStorage ile kişisel fikir kalıcılığı
- JSON yedek içe/dışa aktarma
- Netlify Blobs ile canlı radar önbelleği
- Netlify Scheduled Function ile 6 saatte bir otomatik Reddit taraması

Skor: Acı %25, ödeme isteği %20, tekrar %15, dağıtım %10, MVP kolaylığı %10, rekabet boşluğu %10, kişisel uyum %10.

## İzlenen subredditler
`r/ClaudeAI`, `r/vibecoding`, `r/passive_income`, `r/SideProject`, `r/Entrepreneur`, `r/startups`, `r/marketing`, `r/micro_saas`, `r/founder`, `r/apps`, `r/macapps`, `r/microsaas`, `r/IMadeThis`, `r/iOSAppsMarketing`, `r/juststart`, `r/SaaSMarketing`, `r/DigitalMarketing`, `r/ChatGPT`.

## Netlify
Repo Netlify için `netlify.toml` ile hazırdır. Netlify `package.json` bağımlılıklarını kurar ve Functions klasörünü otomatik algılar.

Yukarıdaki **Deploy to Netlify** düğmesine basıp Netlify hesabınla yetkilendirme yaptıktan sonra site yayınlanır. Git bağlantısı kurulduğunda `main` branch'ine sonraki push'lar otomatik deploy edilir.

Canlı endpoint: `/api/reddit-radar`

Zamanlanmış tarama: `0 */6 * * *` (UTC, 6 saatte bir).

> Not: Reddit klasik üçüncü taraf API erişimini kademeli olarak Developer Platform'a taşıdığı için radar anahtarsız, salt-okuma RSS kaynaklarını kullanır. Kaynak bazlı 403/rate-limit oluşursa panel diğer kaynaklardan gelen sonuçları göstermeye devam eder ve hata sayısını üst bilgiye yazar.
