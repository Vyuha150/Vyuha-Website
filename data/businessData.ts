// data.ts

export interface ServiceCategory {
    title: string;
    items: string[];
    links?: string[];
    actionButton?: {
      text: string;
      href: string;
    };
  }
  
  export interface BusinessServiceSection {
    section: string;
    categories: ServiceCategory[];
  }
  
  export const businessServices: BusinessServiceSection[] = [
    {
      section: "IT Services",
      categories: [
        {
          title: "Branding & Identity",
          items: [
            "Brand Strategy & Positioning",
            "Logo Design & Visual Identity",
            "Brand Guidelines & Storytelling",
            "Marketing Collateral Design (Business Cards, Pitch Decks, etc.)"
          ]
        },
        {
          title: "Business Consulting",
          items: [
            "Digital Transformation Strategy",
            "Product-Market Fit Consultation",
            "Business Model Innovation",
            "Go-to-Market Strategy",
            "Startup Advisory & MVP Planning",
            "Tech Stack Recommendation & Architecture Planning"
          ]
        },
        {
          title: "Digital Marketing",
          items: [
            "Performance Marketing (Google Ads, Meta Ads, etc.)",
            "SEO & Content Strategy",
            "Social Media Management & Campaigns",
            "Email Marketing Automation",
            "Analytics & Conversion Rate Optimization (CRO)",
            "Influencer & Affiliate Marketing"
          ]
        },
        {
          title: "Web & Application Development",
          items: [
            "Custom Website Development (Static, Dynamic, CMS-based)",
            "Full-Stack Web Application Development",
            "Mobile App Development (iOS, Android, Cross-platform)",
            "E-commerce Development (Shopify, WooCommerce, Custom Platforms)",
            "Web Portals (Admin Dashboards, CRMs, Booking Engines, etc.)"
          ],
          actionButton: {
            text: "View Projects",
            href: "/projects"
          }
        },
        {
          title: "AI & Automation",
          items: [
            "AI Agent Development (e.g., custom GPT-based chatbots)",
            "RAG Systems (Retrieval-Augmented Generation)",
            "Natural Language Processing (NLP) Integrations",
            "Process Automation with AI & Machine Learning",
            "Computer Vision & Predictive Analytics",
            "AI Chatbots for Sales, Support & Internal Ops"
          ]
        },
        {
          title: "Product Design (UI/UX)",
          items: [
            "UI/UX Research & Journey Mapping",
            "Wireframing & Prototyping",
            "App & Web Design (Figma, Adobe XD)",
            "Design Systems & Style Guides",
            "Accessibility & Responsive Design"
          ]
        },
        {
          title: "DevOps & Cloud Infrastructure",
          items: [
            "Cloud Setup & Deployment (AWS, Azure, GCP)",
            "CI/CD Pipeline Integration",
            "Containerization (Docker, Kubernetes)",
            "Serverless Architecture",
            "Infrastructure Monitoring & Optimization"
          ]
        },
        {
          title: "Support & Maintenance",
          items: [
            "Application Monitoring & Support",
            "Bug Fixing & Enhancements",
            "Performance Tuning",
            "Ongoing Tech Support & SLA-based Maintenance"
          ]
        }
      ]
    },
    {
      section: "Innovation & Entrepreneurship",
      categories: [
        {
          title: "Incubation & Innovation Clubs",
          items: [
            "Guiding students in transforming ideas into businesses",
            "Mentorship and ecosystem access",
            "Vidhura AI & Entrepreneurship Club for AI and Data Science Projects"
          ],
          links: [
            "https://hackvyuha.com",
            "https://ivyuha.com",
            "https://idealist.org"
          ]
        },
        {
          title: "Hackathons & Challenges",
          items: [
            "HackVyuha: Real-world problem solving & mentorship",
            "Vyuhathon: Prototyping & cash prizes (₹75,000+)",
            "Incubation Pathways for Winners"
          ],
          links: [
            "https://vyhack.tech",
            "https://hackvyuha.com"
          ]
        }
      ]
    },
    {
      section: "Education & Skill Development",
      categories: [
        {
          title: "Technical Skilling",
          items: [
            "On-Demand Courses in Java, C, Python (Apeksha)",
            "Editing Tools Training (SIL)",
            "Skill Development to Boost Employability"
          ],
          links: [
            "https://hackvyuha.com",
            "https://ivyuha.com"
          ]
        },
        {
          title: "Leadership & Personal Growth",
          items: [
            "Stress Management Workshops",
            "The Art of Peaceful Living",
            "Leadership Strategies",
            "Research-Focused Learning Modules"
          ],
          links: [
            "https://ivyuha.com"
          ]
        }
      ]
    },
    {
      section: "Health & Wellness",
      categories: [
        {
          title: "Safe Life Club",
          items: [
            "Awareness on NCDs, Nutrition, Yoga & Fitness",
            "HIV/AIDS Awareness in collaboration with APSACS & UNICEF"
          ],
          links: [
            "https://ivyuha.com"
          ]
        },
        {
          title: "Community Health Drives",
          items: [
            "Large-Scale Health Camps",
            "CPR Training for ~1,600 students",
            "Recognized by APSACS"
          ],
          links: [
            "https://ivyuha.com"
          ]
        }
      ]
    },
    {
      section: "Nature & Animal Protection",
      categories: [
        {
          title: "Environmental Restoration",
          items: [
            "Internship-led canal cleanups",
            "Contributions via community engagement (Aware Andhra)"
          ],
          links: [
            "https://idealist.org",
            "https://ivyuha.com"
          ]
        }
      ]
    },
    {
      section: "Human Rights & Civil Literacy",
      categories: [
        {
          title: "Electoral Literacy Club (AICTE-guided)",
          items: [
            "Democracy and Voter Rights Education",
            "Part of Election Commission's SVEEP campaign",
            "Engaged 1,500+ students and enabled 500+ new voter registrations"
          ],
          links: [
            "https://ivyuha.com"
          ]
        }
      ]
    },
    {
      section: "Spirituality & Well-being",
      categories: [
        {
          title: "Personal Harmony",
          items: [
            "Courses on self-awareness & stress relief",
            "Purposeful living practices rooted in inner peace",
            "The Art of Peaceful Living"
          ],
          links: [
            "https://ivyuha.com",
            "https://idealist.org"
          ]
        }
      ]
    }
  ];
  