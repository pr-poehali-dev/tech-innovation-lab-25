import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Умные ответы на любые вопросы",
    description: "Задайте любой вопрос — Nova AI мгновенно даёт точный, развёрнутый ответ на основе актуальных знаний.",
    icon: "brain",
    badge: "Диалог",
  },
  {
    title: "Написание кода",
    description: "Генерация, отладка и объяснение кода на любом языке программирования — от простых скриптов до сложных алгоритмов.",
    icon: "zap",
    badge: "Dev",
  },
  {
    title: "Генерация изобретений",
    description: "Опишите задачу — ИИ предложит оригинальные технические решения, патентные идеи и инновационные концепции.",
    icon: "target",
    badge: "Идеи",
  },
  {
    title: "Живое общение",
    description: "Полноценный диалог с ИИ: обсуждайте идеи, получайте советы и находите решения в режиме реального времени.",
    icon: "globe",
    badge: "Чат",
  },
  {
    title: "Безопасность данных",
    description: "Все ваши запросы и данные надёжно защищены — полная конфиденциальность и шифрование на всех уровнях.",
    icon: "lock",
    badge: "Защита",
  },
  {
    title: "Многозадачность",
    description: "Одновременная работа с несколькими проектами: текст, код, расчёты и исследования в одном окне.",
    icon: "link",
    badge: "Всё в одном",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div id="features" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Всё, что умеет Nova AI</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Один ассистент для всех задач — от простых вопросов до сложных технических решений
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">
                    {feature.icon === "brain" && "&#129504;"}
                    {feature.icon === "lock" && "&#128274;"}
                    {feature.icon === "globe" && "&#127760;"}
                    {feature.icon === "zap" && "&#9889;"}
                    {feature.icon === "link" && "&#128279;"}
                    {feature.icon === "target" && "&#127919;"}
                  </span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}