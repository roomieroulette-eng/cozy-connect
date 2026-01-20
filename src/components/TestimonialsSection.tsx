import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Marketing Manager",
      quote:
        "Found my roommate in just 2 weeks! We matched on lifestyle preferences and it's been perfect. Best decision I made for my NYC apartment.",
      rating: 5,
      avatar: "🙋‍♀️",
    },
    {
      name: "Michael T.",
      role: "Software Developer",
      quote:
        "The matching algorithm is spot on. It filtered out incompatible people and I only saw profiles that matched my vibe. Super efficient!",
      rating: 5,
      avatar: "🙋‍♂️",
    },
    {
      name: "Priya K.",
      role: "Graduate Student",
      quote:
        "As an international student, finding a trustworthy roommate was stressful. RoomMatch made it easy with verified profiles and clear preferences.",
      rating: 5,
      avatar: "🙋‍♀️",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Loved by
            <span className="text-gradient-warm"> 50,000+ </span>
            Roommates
          </h2>
          <p className="text-lg text-muted-foreground">
            Real stories from people who found their perfect roommate match.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              variant="elevated"
              className="group hover:-translate-y-2 transition-all duration-300"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
