import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Алексей Смирнов",
    role: "Senior Backend Developer, Skytech",
    avatar: "/cybersecurity-expert-man.jpg",
    content:
      "Nova AI экономит мне 3–4 часа в день. Пишет боilerplate-код, объясняет ошибки и предлагает оптимизации — как умный коллега рядом.",
  },
  {
    name: "Мария Волкова",
    role: "Основатель стартапа, IdeaForge",
    avatar: "/professional-woman-scientist.png",
    content:
      "Использую Nova AI для генерации патентных концепций. За месяц проработали 12 идей — 3 уже на стадии прототипа. Невероятный инструмент.",
  },
  {
    name: "Ли Сяомин",
    role: "Студент MIT, направление Computer Science",
    avatar: "/asian-woman-tech-developer.jpg",
    content:
      "Объясняет сложные алгоритмы лучше любого учебника. Готовлюсь к экзаменам с Nova AI — понимание приходит в разы быстрее.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-card-foreground mb-4 font-sans">Что говорят пользователи</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Разработчики, предприниматели и студенты уже работают умнее с Nova AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glow-border slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
              <CardContent className="p-6">
                <p className="text-card-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}