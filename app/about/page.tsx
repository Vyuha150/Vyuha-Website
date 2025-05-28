import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="max-w-5xl bg-transparent mx-auto py-12 px-4 border-none">
      <Card className="bg-transparent text-white border-none">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <Image
                src="/anna.png" // <-- update this path to your image
                alt="J.V. Kalyan"
                width={380}
                height={380}
                className="rounded-2xl object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-orange-500 mb-2">
                J.V. Kalyan
              </h1>
              <h2 className="text-lg text-muted-foreground mb-2">
                (Venkat Kalyan Javvaji)
              </h2>
              <Badge variant="secondary" className="mb-4">
                Founder & Chairman, Vyuha Innovation Foundation
              </Badge>
              <p className="mb-4 text-base leading-relaxed">
                J.V. Kalyan is a forward-thinking youth leader and innovation
                strategist committed to redefining education, leadership, and
                civic responsibility in India. He is the Founder and Chairman of
                Vyuha Innovation Foundation, a youth-centric organization based
                in Andhra Pradesh, focused on empowering students and young
                professionals through conscious leadership, digital
                transformation, and grassroots innovation.
              </p>
              <p className="mb-4 text-base leading-relaxed">
                With a strong belief in creating systemic change through
                collective intelligence and practical action, Kalyan has
                dedicated his life to nurturing a new generation of self-aware,
                socially responsible, and purpose-driven individuals. His work
                bridges the worlds of policy, education, and technology to
                create sustainable, scalable impact.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-orange-500 mb-2">
              Leadership and Vision
            </h3>
            <p className="mb-4 text-base leading-relaxed">
              Kalyan’s leadership style is grounded in clarity, collaboration,
              and consciousness. He envisions a future where young people lead
              from the front—not just in corporate and academic spaces, but also
              in governance, innovation, and nation-building. His initiatives
              focus on experiential learning, community development, and
              unlocking the creative potential of youth.
            </p>
            <h3 className="text-2xl font-bold text-orange-500 mb-2">
              Key Highlights
            </h3>
            <ul className="list-disc list-inside mb-4 space-y-1 text-base">
              <li>
                <span className="font-bold text-orange-400">
                  Founder of Vyuha Innovation Foundation:
                </span>{" "}
                A pioneering platform that blends education, leadership
                incubation, and innovation labs to build future-ready youth.
              </li>
              <li>
                <span className="font-bold text-orange-400">
                  Youth-Governance Engagement Advocate:
                </span>{" "}
                Actively working to integrate students and professionals into
                civic participation and policy awareness.
              </li>
              <li>
                <span className="font-bold text-orange-400">
                  Strategic Collaborator:
                </span>{" "}
                Works with social and educational institutions for grassroots
                interventions, including digital campaigns, relief programs, and
                educational outreach.
              </li>
              <li>
                <span className="font-bold text-orange-400">
                  Public Speaker and Thought Leader:
                </span>{" "}
                On topics including digital transformation, ethical leadership,
                emotional intelligence, and innovation-driven social change.
              </li>
              <li>
                <span className="font-bold text-orange-400">
                  Mentor and Guide:
                </span>{" "}
                To emerging student leaders and social entrepreneurs, nurturing
                a culture of vision-driven execution.
              </li>
            </ul>
            <h3 className="text-2xl font-bold text-orange-500 mb-2">Mission</h3>
            <p className="text-base leading-relaxed">
              J.V. Kalyan’s mission is to catalyze a national movement of
              youth-led transformation by designing systems that awaken purpose,
              foster critical thinking, and empower leadership at every level of
              society.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
