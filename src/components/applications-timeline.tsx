import { Timeline } from "@/components/ui/timeline"

export function ApplicationsTimeline() {
  const data = [
    {
      title: "Разработчикам и техспециалистам",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Nova AI пишет, анализирует и отлаживает код на любом языке. Объясняет сложные алгоритмы,
            предлагает архитектурные решения и помогает разобраться в чужом коде за секунды.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Python, JavaScript, Rust, Go и 50+ языков
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Поиск и исправление багов в реальном времени
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Генерация тестов, документации и API
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Изобретателям и предпринимателям",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Опишите проблему — Nova AI предложит оригинальные технические решения, поможет проработать
            идею, найдёт аналоги и составит концепцию нового продукта или патента.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Генерация патентных идей и технических концепций
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Анализ рынка и поиск незанятых ниш
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Проработка бизнес-модели и MVP
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Всем, кто ищет ответы",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Учёба, работа, личные вопросы — Nova AI готов помочь с чем угодно. Объясняет сложное просто,
            помогает принять решение и поддерживает живой разговор на любую тему.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Объяснение любой темы простым языком
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Помощь с учёбой, эссе и исследованиями
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Живой диалог 24/7 без ограничений
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section id="applications" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">Кому подходит Nova AI</h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Nova AI помогает разработчикам, изобретателям и всем, кто хочет думать быстрее,
            работать эффективнее и находить ответы мгновенно.
          </p>
        </div>

        <div className="relative">
          <Timeline data={data} />
        </div>
      </div>
    </section>
  )
}