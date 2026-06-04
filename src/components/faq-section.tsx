import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Что умеет Nova AI?",
      answer:
        "Nova AI отвечает на любые вопросы, помогает писать и отлаживать код на любом языке, генерирует изобретательские идеи и концепции, а также поддерживает живой диалог на любую тему — всё в одном окне.",
    },
    {
      question: "Нужны ли технические знания для работы с Nova AI?",
      answer:
        "Нет. Nova AI понимает обычный человеческий язык. Просто опишите задачу — ИИ разберётся, уточнит детали и предложит решение. Никаких специальных навыков не требуется.",
    },
    {
      question: "На каких языках программирования пишет код Nova AI?",
      answer:
        "Nova AI работает с более чем 50 языками: Python, JavaScript, TypeScript, Rust, Go, Java, C++, SQL, Swift и другими. Он пишет, объясняет, оптимизирует и находит ошибки в коде.",
    },
    {
      question: "Мои данные в безопасности?",
      answer:
        "Да. Все запросы передаются по зашифрованному каналу. Мы не храним историю чатов дольше сессии и не передаём данные третьим лицам. Ваша конфиденциальность — наш приоритет.",
    },
    {
      question: "Можно ли использовать Nova AI для бизнеса?",
      answer:
        "Абсолютно. Nova AI помогает анализировать данные, составлять документы, генерировать идеи для продуктов, автоматизировать рутину и решать бизнес-задачи быстрее и эффективнее.",
    },
    {
      question: "Насколько Nova AI точен в ответах?",
      answer:
        "Nova AI основан на современных языковых моделях и даёт высокоточные ответы. Для специализированных или узкопрофессиональных вопросов рекомендуем уточнять ответы у профильных экспертов.",
    },
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">Частые вопросы</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-space-mono">
            Всё, что нужно знать о Nova AI — возможности, безопасность и практическое применение.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-red-500/20 mb-4">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-red-400 font-orbitron px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed px-6 pb-4 font-space-mono">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}