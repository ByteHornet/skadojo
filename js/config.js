/* ==========================================================================
   SKA DOJO – CENTRAL CONFIGURATION
   Edit this file to change content across the site.
   Every value marked "PLACEHOLDER" must be replaced with verified information
   before launch. Items with `placeholder: true` show a visible "Placeholder"
   badge on the page so nothing unverified is mistaken for fact.
   ========================================================================== */
window.SKA_CONFIG = {
  dojo: {
    name: "SKA DOJO",
    tagline: "Strength starts here.",
    description:
      "Empowering students of all ages through expert Kyokushin Karate in a welcoming, family-focused environment.",
  },

  contact: {
    phone: "", // e.g. "+91 00000 00000"  (leave "" until confirmed)
    whatsapp: "", // digits only with country code, e.g. "910000000000"
    email: "", // e.g. "info@example.com"
    whatsappMessage: "Hello SKA DOJO, I would like to enquire about a trial class.",
  },

  social: {
    // Leave "" to hide a link. Only add real, confirmed accounts.
    instagram: "",
    facebook: "",
    youtube: "",
  },

  /* Trial booking endpoint. While empty, the form only validates in the browser
     and NOTHING is sent. Set to a form service / backend URL that accepts a JSON POST. */
  trialEndpoint: "",

  /* Featured event shown on hero slide 2 (editable placeholders). */
  featuredEvent: {
    label: "Upcoming Event",
    title: "[PLACEHOLDER] Event title",
    date: "[PLACEHOLDER] Date",
    location: "[PLACEHOLDER] Location",
    href: "#events",
  },

  branches: [
    {
      id: "main",
      name: "[PLACEHOLDER] Main Dojo",
      address: "[PLACEHOLDER] Street address, City, State, PIN",
      schedule: "[PLACEHOLDER] Days & timings to be confirmed",
      phone: "", // falls back to contact.phone
      directionsUrl: "", // e.g. a Google Maps share link
      mapUrl: "",
      placeholder: true,
    },
  ],

  /* Placeholder programme categories – replace with the real SKA DOJO programmes. */
  programs: [
    {
      id: "kids",
      name: "Kids Karate",
      image: "assets/images/program-kids.jpg",
      alt: "Instructor leading students through hand techniques on a training field",
      description: "A fun, structured introduction to Kyokushin focusing on discipline, focus and confidence.",
      level: "Children (age range to be confirmed)",
      instructor: "[Instructor to be confirmed]",
      branch: "[PLACEHOLDER] Main Dojo",
      schedule: "[PLACEHOLDER] Days & timings",
      planUrl: "", // pricing / enrolment page. Leave "" until it exists.
      placeholder: true,
    },
    {
      id: "adult",
      name: "Adult Karate",
      image: "assets/images/program-adults.jpg",
      alt: "Six adult karateka performing a kata together",
      description: "Full-contact-minded conditioning, kihon, kata and kumite for adult practitioners.",
      level: "Adults",
      instructor: "[Instructor to be confirmed]",
      branch: "[PLACEHOLDER] Main Dojo",
      schedule: "[PLACEHOLDER] Days & timings",
      planUrl: "",
      placeholder: true,
    },
    {
      id: "beginner",
      name: "Beginner Training",
      image: "assets/images/program-beginners.jpg",
      alt: "Students and instructor standing in formation",
      description: "No experience needed. Learn fundamentals, etiquette and technique at a supportive pace.",
      level: "Beginners, all ages",
      instructor: "[Instructor to be confirmed]",
      branch: "[PLACEHOLDER] Main Dojo",
      schedule: "[PLACEHOLDER] Days & timings",
      planUrl: "",
      placeholder: true,
    },
    {
      id: "advanced",
      name: "Advanced Training",
      image: "assets/images/program-advanced.jpg",
      alt: "Two advanced karateka in a flying-kick exchange",
      description: "Refine technique, build power and prepare for higher gradings and tournaments.",
      level: "Experienced students",
      instructor: "[Instructor to be confirmed]",
      branch: "[PLACEHOLDER] Main Dojo",
      schedule: "[PLACEHOLDER] Days & timings",
      planUrl: "",
      placeholder: true,
    },
  ],

  instructors: [
    {
      name: "[PLACEHOLDER] Sensei Name",
      rank: "[Dan rank – to be verified]",
      title: "[Official title / teaching role]",
      bio: "[Short biography or teaching philosophy supplied by the dojo.]",
      image: "assets/images/instructor-01.jpg",
      placeholder: true,
    },
    {
      name: "[PLACEHOLDER] Instructor Name",
      rank: "[Dan rank – to be verified]",
      title: "[Official title / teaching role]",
      bio: "[Short biography or teaching philosophy supplied by the dojo.]",
      image: "assets/images/instructor-02.jpg",
      placeholder: true,
    },
    {
      name: "[PLACEHOLDER] Instructor Name",
      rank: "[Dan rank – to be verified]",
      title: "[Official title / teaching role]",
      bio: "[Short biography or teaching philosophy supplied by the dojo.]",
      image: "assets/images/instructor-03.jpg",
      placeholder: true,
    },
  ],

  testimonials: [
    // Replace with genuine, approved testimonials. Never invent quotes.
    { quote: "[Approved student or parent testimonial goes here.]", name: "[Approved display name]", role: "Student", placeholder: true },
    { quote: "[Approved student or parent testimonial goes here.]", name: "[Approved display name]", role: "Parent", placeholder: true },
    { quote: "[Approved student or parent testimonial goes here.]", name: "[Approved display name]", role: "Student", placeholder: true },
  ],

  events: [
    // Add real events here. Leave the array empty to show an "announced soon" card.
    {
      title: "[PLACEHOLDER] Tournament / Grading / Seminar",
      type: "Event",
      date: "[PLACEHOLDER] Date & time",
      venue: "[PLACEHOLDER] Venue or branch",
      description: "[Short description of the event.]",
      status: "Registration status to be confirmed",
      image: "assets/images/event-featured.jpg",
      href: "#trial",
      placeholder: true,
    },
  ],

  faqs: [
    { q: "Who can join SKA DOJO?", a: "Our training is intended for children, adults, beginners and experienced karatekas. [Confirm age limits and eligibility.]" },
    { q: "Can beginners start without prior experience?", a: "Yes, beginners are welcome to enquire. Classes start with fundamentals and etiquette. [Confirm beginner class availability.]" },
    { q: "At what age can children begin?", a: "[PLACEHOLDER – confirm the minimum age for children's classes.]" },
    { q: "What should I wear for my first class?", a: "Comfortable, loose sportswear is usually suitable for a first visit. [Confirm dress code and whether a gi is required.]" },
    { q: "Where are classes conducted?", a: "See the “Find Your Dojo” section for venues. [Branch details to be confirmed.]" },
    { q: "What are the class timings?", a: "[PLACEHOLDER – add confirmed class days and timings for each programme.]" },
    { q: "How do I book a trial class?", a: "Complete the trial request form on this page and the dojo will follow up. [Confirm the follow-up process and whether trials are free.]" },
    { q: "What are the membership fees?", a: "[PLACEHOLDER – add confirmed membership fees and payment terms.]" },
    { q: "What equipment will I need?", a: "[PLACEHOLDER – list uniform, protective gear and any other equipment required.]" },
    { q: "How do grading examinations work?", a: "[PLACEHOLDER – describe the dojo's grading schedule, requirements and fees.]" },
  ],
};
