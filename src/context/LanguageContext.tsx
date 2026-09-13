"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_new_arrivals: "New Arrivals",
    nav_categories: "Categories",
    nav_lifestyle: "Lifestyle & Accents",
    nav_shop_by_origin: "Shop By Origin",
    nav_shop_by_color: "Shop By Color",
    nav_best_seller: "Best Seller",
    nav_contact: "Contact",
    nav_atelier: "Studio",
    nav_menu: "Menu",
    nav_close: "Close",

    // Hero
    hero_eyebrow: "Sarees Woven With",
    hero_heading: "Culture",
    hero_subtitle_1: "Heirloom Drapes",
    hero_subtitle_2: "For Modern Stories",
    hero_description:
      "Centuries of Bengali weaving wisdom carried forward in pure mulberry silks, Dhakai Jamdani, and hand-beaten gold zari.",
    hero_cta: "Explore The Collection",
    hero_stat_1: "40+ Drapes",
    hero_stat_2: "Heritage Craftsmanship",
    hero_stat_3: "Curated Dhaka Atelier",

    // New Arrivals
    new_arrivals_pill: "New Arrivals",
    new_arrivals_heading_1: "Fresh Weaves,",
    new_arrivals_heading_2: "Timeless Grace",
    new_arrivals_subtitle:
      "Colors chosen with care — for every mood, festive evening, and special occasion.",
    new_arrivals_cta: "Discover New Arrivals",
    new_arrivals_footnote: "Ancient Bengal Craft, Modern Soul",
    view_details: "Quick View",

    // Sarees by Origin
    origin_pill: "The Collection",
    origin_heading: "Sarees By Origin",
    origin_subtitle:
      "Preserving generational craft traditions across Bangladesh & the subcontinent.",
    origin_tag: "Signature Weave Archive",
    origin_atelier: "Avoroni Dhaka",

    // Shop by Color
    color_pill: "Explore Every Shade",
    color_heading: "Shop By Color",
    color_subtitle: "Rich palettes for every sentiment & celebration",
    color_cta_prefix: "View All",
    color_cta_suffix: "Sarees",

    // Best Sellers
    bestseller_pill: "The Most Loved",
    bestseller_heading: "Best Sellers",
    bestseller_subtitle:
      "The drapes our women wear — chosen with love, woven into lasting memories.",
    bestseller_cta: "Explore All",
    bestseller_footnote: "More Than A Saree — An Heirloom",

    // Editorial Archive
    editorial_pill: "Archival Monograph",
    editorial_movement: "Movement I • The Sacred Continuum",
    editorial_heading: "Where Warp Meets Eternity",
    editorial_subtitle:
      "Archival textile editorial showcasing the interplay of pure 24k gold zari, hand-spun muslin, and heritage subcontinent weaves.",
    editorial_monograph_pill: "Curator’s Monograph",
    editorial_monograph_quote:
      "“In traditional handloom philosophy, the uncut fabric is sacred. To shear it is to diminish its cosmic continuum.”",
    editorial_monograph_desc:
      "Every warp and weft woven at Avoroni honors the discipline of continuous gold thread filigree. Our master artisans in Narayanganj, Mirpur, and heritage craft clusters practice pit-loom weaving where each motif is interlocked by hand, requiring months of silent devotion.",
    editorial_palette_btn: "Discover The Palette →",
    editorial_plate_1_title: "Plate I • Imperial Kashi Brocade",
    editorial_plate_1_tag: "Kashi Silk Archive",
    editorial_plate_2_title: "Plate II • 24k Zari Filament",
    editorial_plate_2_tag: "180 Handloom Hours",
    editorial_poetic_quote:
      "“The gold does not fade; it merely learns the contours of the wearer, softening into a family heirloom across centuries.”",
    editorial_quote_caption: "The Heritage Weaving Registry • Avoroni Dhaka",
    editorial_plate_3_title: "Plate III • Peacock Emerald Kanchipuram",
    editorial_plate_3_tag: "Pure Zari Twill",

    // Contact
    contact_pill: "Contact Us",
    contact_heading: "We'd Love to Hear From You",
    contact_subtitle:
      "Whether it's bridal styling, selecting a Jamdani heirloom, or visiting our Banani studio — our curators are here for you.",
    contact_friends_caption: "Avoroni Studio • Banani, Dhaka",
    contact_call_label: "Call Us / WhatsApp",
    contact_call_val: "+880 1712-345678",
    contact_call_hours: "Mon–Sat, 10am – 8pm BST",
    contact_email_label: "Email Us",
    contact_email_val: "contact@avoroni.com",
    contact_email_sub: "We reply within 24 hours",
    contact_studio_label: "Visit Our Studio",
    contact_studio_val: "House 42, Road 11, Block D, Banani, Dhaka-1213",
    contact_directions: "Get Directions",
    contact_follow_label: "Follow Us",
    contact_form_title: "Send Us A Message",
    contact_form_badge: "Personal Stylist",
    contact_form_name: "Full Name",
    contact_form_name_ph: "e.g. Nusrat Jahan",
    contact_form_email: "Email Address",
    contact_form_email_ph: "nusrat@example.com",
    contact_form_phone: "Phone / WhatsApp",
    contact_form_phone_ph: "+880 1819-234567",
    contact_form_occasion: "Occasion / Saree Preference",
    contact_form_msg: "Your Message",
    contact_form_msg_ph:
      "Tell us about your wedding date, Jamdani preference, or drape questions...",
    contact_form_send: "Send Message",
    contact_form_sending: "Sending...",
    contact_form_success: "Message Sent Successfully",
    contact_form_thanks:
      "Thank you. Our Dhaka textile stylist will contact you within 24 hours.",

    // Footer
    footer_quote:
      "“Preserving the sovereign handloom heritage of Bengal and the subcontinent through modern architectural restraint.”",
    footer_register: "Dhaka Atelier • Road 11, Banani, Dhaka",
    footer_cert: "GI Certified Dhakai Jamdani & Silk Mark",
    footer_city: "Dhaka",
    footer_copy: "AVORONI SAREE MAISON. ALL RIGHTS RESERVED.",
    footer_trust_1: "GI Certified Jamdani",
    footer_trust_2: "Handloom Board Registry",
    footer_trust_3: "Nationwide & Global Delivery",
    footer_gazette_title: "Atelier Gazette",
    footer_gazette_desc:
      "Receive private invitations to seasonal loom releases & festive edits.",
    footer_gazette_sub: "Subscribe",

    // Chatbot / Concierge
    chatbot_launcher_badge: "Ask Concierge",
    chatbot_launcher_sub: "Product & Weave Guide",
    chatbot_title: "Avoroni Concierge",
    chatbot_subtitle: "Dhaka Atelier Textile Guide",
    chatbot_status: "Active Concierge",
    chatbot_greeting_title: "Welcome to Avoroni Maison",
    chatbot_greeting_desc:
      "Namaskar & Welcome. I am your personal textile concierge. Ask me anything about our authentic Dhakai Jamdani, Rajshahi silks, Mirpur bridal katans, fabric care, blouse pieces, or Banani studio appointments.",
    chatbot_quick_questions: "Popular Inquiries & Topics",
    chatbot_input_ph: "Ask about weaves, prices, care, or delivery...",
    chatbot_send: "Send",
    chatbot_typing: "Reviewing weave archives...",
    chatbot_reset: "Reset Chat",
    chatbot_close: "Close Chat",
    chatbot_whatsapp_help: "Need bespoke bridal styling? Speak with our Dhaka stylist on WhatsApp",
    chatbot_whatsapp_btn: "WhatsApp Atelier",
    chatbot_view_product: "View Saree",
    chatbot_related_heading: "Related Inquiries:",
    chatbot_no_match:
      "I couldn't find an exact match in our immediate weave archives, but our Banani atelier curators are available to assist you personally.",

    // Maison Trust & Craft Guarantees
    trust_bar_gi_title: "GI & Silk Mark Certified",
    trust_bar_gi_desc: "UNESCO Intangible Handloom Authenticity",
    trust_bar_hemming_title: "Fall & Pico Included",
    trust_bar_hemming_desc: "Complimentary ready-to-drape finish",
    trust_bar_delivery_title: "Pan-Bangladesh Express",
    trust_bar_delivery_desc: "Insured delivery & COD available",
    trust_bar_video_title: "Banani Atelier Video Call",
    trust_bar_video_desc: "Live HD drape consultation & preview",

    // Accolades & Social Proof
    accolades_pill: "Patrons & Bridal Acclaim",
    accolades_heading_1: "Woven Into Memories,",
    accolades_heading_2: "Cherished For Generations",
    accolades_subtitle:
      "Words of admiration from discerning brides, cultural patrons, and the global Bangladeshi diaspora.",
    accolades_verified: "Verified Atelier Patron",
    accolades_view_archive: "Explore Curated Archive",

    // Quick Order & Studio Actions
    order_via_whatsapp: "Order via WhatsApp",
    try_in_mirror: "Virtual Fitting",
    only_one_left: "Heritage Archive • 1 Piece Available",
    artisan_crafted: "Generational Handloom Weave",
    quick_view_title: "Atelier Quick Preview",
    mobile_bar_studio: "Virtual Studio",
    mobile_bar_chat: "WhatsApp Concierge",
    quick_order: "Quick Order (COD)",
    quick_order_subtitle: "Instant 1-Click Order • Pay When You Receive",
    customer_name: "Full Name",
    customer_name_ph: "e.g. Nusrat Jahan",
    customer_phone: "Mobile Phone Number",
    customer_phone_ph: "017XXXXXXXX",
    delivery_address: "Full Delivery Address",
    delivery_address_ph: "House, Road, Area, District/Thana...",
    delivery_zone: "Delivery Location",
    zone_dhaka: "Inside Dhaka (৳ 80 • 24–48 Hours)",
    zone_outside: "Outside Dhaka (৳ 150 • 2–4 Days)",
    zone_free: "Complimentary Free Shipping (৳ 10,000+)",
    payment_method: "Payment Option",
    payment_cod: "Cash on Delivery (Inspect & Pay)",
    payment_bkash: "bKash / Nagad (Instant Pay)",
    order_notes: "Special Instructions (Optional)",
    order_notes_ph: "Gift box wrapping, preferred delivery time...",
    order_summary: "Order Summary",
    subtotal: "Saree Price",
    delivery_charge: "Delivery Charge",
    total_payable: "Total Payable",
    place_order_btn: "Confirm Cash on Delivery Order",
    order_submitting: "Securing Your Drape...",
    order_success_title: "Order Placed Successfully!",
    order_success_msg: "Our Banani Dhaka atelier concierge will call you shortly to confirm packaging and dispatch.",
    order_id: "Order Reference ID",
    chat_whatsapp_order: "Chat on WhatsApp with Order ID",
    continue_shopping: "Continue Browsing",
  },
  bn: {
    // Navigation
    nav_home: "হোম",
    nav_new_arrivals: "নতুন কালেকশন",
    nav_categories: "ক্যাটাগরি",
    nav_lifestyle: "অনুষঙ্গ ও সম্ভার",
    nav_shop_by_origin: "অঞ্চলের শাড়ি",
    nav_shop_by_color: "রঙের ছটায়",
    nav_best_seller: "বেস্ট সেলার",
    nav_contact: "যোগাযোগ",
    nav_atelier: "স্টুডিও",
    nav_menu: "মেনু",
    nav_close: "বন্ধ করুন",

    // Hero
    hero_eyebrow: "ঐতিহ্যের বোনা",
    hero_heading: "সংস্কৃতি",
    hero_subtitle_1: "চিরন্তন আভিজাত্য",
    hero_subtitle_2: "আধুনিক রমণীর গল্পে",
    hero_description:
      "শতবর্ষের ঐতিহ্যবাহী ঢাকাই জামদানি, রাজশাহীর খাঁটি রেশম সিল্ক ও হাতে বোনা জরির রাজকীয় সমাহার।",
    hero_cta: "কালেকশন দেখুন",
    hero_stat_1: "৪০+ শাড়ি",
    hero_stat_2: "ঐতিহ্যবাহী তাঁত শিল্প",
    hero_stat_3: "অনন্য ঢাকা স্টুডিও",

    // New Arrivals
    new_arrivals_pill: "নতুন আগমন",
    new_arrivals_heading_1: "নতুন বুনন,",
    new_arrivals_heading_2: "চিরন্তন রূপ",
    new_arrivals_subtitle:
      "প্রতিটি বিশেষ মুহূর্ত ও উৎসবের জন্য পরম যত্নে বাছাইকৃত ঐতিহ্যবাহী রঙ ও বুনন।",
    new_arrivals_cta: "নতুন শাড়ি দেখুন",
    new_arrivals_footnote: "প্রাচীন বাংলার তাঁত, আধুনিক নান্দনিকতা",
    view_details: "বিস্তারিত",

    // Sarees by Origin
    origin_pill: "সিগনেচার কালেকশন",
    origin_heading: "অঞ্চলভিত্তিক শাড়ি",
    origin_subtitle:
      "বাংলার ঐতিহ্যবাহী তাঁত ও উপমহাদেশের সেরা বুনন শিল্পের চিরন্তন রূপ।",
    origin_tag: "ঐতিহাসিক তাঁত আর্কাইভ",
    origin_atelier: "আভরণী ঢাকা",

    // Shop by Color
    color_pill: "রঙের বৈচিত্র্য",
    color_heading: "রঙের ছটায় শাড়ি",
    color_subtitle: "প্রতিটি অনুভূতির গভীরতায় বর্ণিল রঙের সম্ভার",
    color_cta_prefix: "সব",
    color_cta_suffix: "শাড়ি দেখুন",

    // Best Sellers
    bestseller_pill: "সবার প্রিয়",
    bestseller_heading: "বেস্ট সেলার",
    bestseller_subtitle:
      "আমাদের প্রিয় রমণীদের পছন্দের শীর্ষে থাকা শাড়ি — ভালোবাসায় মোড়া, স্মৃতির সুতোয় বোনা।",
    bestseller_cta: "সবগুলো দেখুন",
    bestseller_footnote: "শুধু শাড়ি নয় — এক অমূল্য ঐতিহ্য",

    // Editorial Archive
    editorial_pill: "ঐতিহাসিক মনোগ্রাফ",
    editorial_movement: "প্রথম পর্ব • শাশ্বত তাঁতশিল্পের মেলবন্ধন",
    editorial_heading: "যেখানে সুতোয় রচিত হয় অনন্তকাল",
    editorial_subtitle:
      "খাঁটি ২৪ ক্যারেট সোনার জরি, হাতে কাটা মসলিন এবং উপমহাদেশের অনন্য বুননশিল্পের রাজকীয় এডিটরিয়াল সংকলন।",
    editorial_monograph_pill: "কিউরেটরের বার্তা",
    editorial_monograph_quote:
      "“ঐতিহ্যবাহী তাঁতের দর্শনে অকর্তিত শাড়ির জমিন এক অপাপবিদ্ধ পবিত্রতা। প্রতিটি বুননই জীবনের এক নিরবচ্ছিন্ন প্রবাহ।”",
    editorial_monograph_desc:
      "আভরণীর প্রতিটি টানা ও পোড়েনের সুতোয় সংরক্ষিত সোনার জরির বিশুদ্ধতা। রূপগঞ্জের শীতলক্ষ্যা তীর, মীরপুর কাতানপল্লী ও উপমহাদেশের ঐতিহ্যবাহী তাঁতশিল্পী পরিবারগুলো বংশপরম্পরায় নিখুঁত হাতে ফুটিয়ে তোলেন প্রতিটি মোটিফ, যার পেছনে থাকে মাসের পর মাস নীরব সাধনা।",
    editorial_palette_btn: "রং ও কালেকশন দেখুন →",
    editorial_plate_1_title: "প্লেট ১ • রাজকীয় বেনারসি ব্রোকেড",
    editorial_plate_1_tag: "বেনারসি সিল্ক আর্কাইভ",
    editorial_plate_2_title: "প্লেট ২ • ২৪ ক্যারেট জরি ফিলামেন্ট",
    editorial_plate_2_tag: "১৮০ ঘণ্টার হস্তশিল্প",
    editorial_poetic_quote:
      "“খাঁটি সোনার দীপ্তি কখনো ম্লান হয় না; বরং প্রজন্মের পর প্রজন্ম স্পর্শ করে হয়ে ওঠে চিরন্তন পারিবারিক সম্পদ।”",
    editorial_quote_caption: "হেরিটেজ উইভিং রেজিস্ট্রি • আভরণী ঢাকা",
    editorial_plate_3_title: "প্লেট ৩ • ময়ূরকণ্ঠী পান্না কাঞ্জিভরম",
    editorial_plate_3_tag: "খাঁটি জরি টুইল",

    // Contact
    contact_pill: "যোগাযোগ",
    contact_heading: "আপনার বার্তা পাঠাতে পারেন",
    contact_subtitle:
      "বিয়ের শাড়ি নির্বাচন, কাস্টম জামদানি বা যেকোনো তথ্যের জন্য আমাদের বনানী স্টুডিওর সাথে যোগাযোগ করুন।",
    contact_friends_caption: "আভরণী স্টুডিও • বনানী, ঢাকা",
    contact_call_label: "কল / হোয়াটসঅ্যাপ",
    contact_call_val: "+৮৮০ ১৭১২-৩৪৫৬৭৮",
    contact_call_hours: "সোম–শনি, সকাল ১০টা – রাত ৮টা BST",
    contact_email_label: "ইমেইল করুন",
    contact_email_val: "contact@avoroni.com",
    contact_email_sub: "আমরা ২৪ ঘণ্টার মধ্যে উত্তর দিই",
    contact_studio_label: "আমাদের স্টুডিও",
    contact_studio_val: "বাড়ি ৪২, রোড ১১, ব্লক ডি, বনানী, ঢাকা-১২১৩",
    contact_directions: "ম্যাপে দেখুন",
    contact_follow_label: "ফলো করুন",
    contact_form_title: "বার্তা পাঠান",
    contact_form_badge: "ব্যক্তিগত স্টাইলিস্ট",
    contact_form_name: "আপনার পূর্ণ নাম",
    contact_form_name_ph: "উদা: নুসরাত জাহান",
    contact_form_email: "ইমেইল ঠিকানা",
    contact_form_email_ph: "nusrat@example.com",
    contact_form_phone: "ফোন / হোয়াটসঅ্যাপ",
    contact_form_phone_ph: "+৮৮০ ১৮১৯-২৩৪৫৬৭",
    contact_form_occasion: "অনুষ্ঠান বা শাড়ির পছন্দ",
    contact_form_msg: "আপনার বার্তা",
    contact_form_msg_ph:
      "আপনার বিয়ের তারিখ, জামদানি বা পছন্দের শাড়ি সম্পর্কে বিস্তারিত লিখুন...",
    contact_form_send: "বার্তা পাঠান",
    contact_form_sending: "পাঠানো হচ্ছে...",
    contact_form_success: "বার্তা সফলভাবে পাঠানো হয়েছে",
    contact_form_thanks:
      "ধন্যবাদ। আমাদের ঢাকার টেক্সটাইল স্টাইলিস্ট ২৪ ঘণ্টার মধ্যে যোগাযোগ করবেন।",

    // Footer
    footer_quote:
      "“আধুনিক নান্দনিকতায় বাংলার তাঁত ও রেশম শিল্পের রাজকীয় ঐতিহ্য সংরক্ষণ।”",
    footer_register: "ঢাকা স্টুডিও • রোড ১১, বনানী, ঢাকা",
    footer_cert: "জিআই সার্টিফায়েড ঢাকাই জামদানি ও সিল্ক মার্ক",
    footer_city: "ঢাকা",
    footer_copy: "আভরণী শাড়ি মেসন। সর্বস্বত্ব সংরক্ষিত।",
    footer_trust_1: "জিআই সার্টিফায়েড জামদানি",
    footer_trust_2: "বাংলাদেশ তাঁত বোর্ড রেজিস্ট্রি",
    footer_trust_3: "সারাদেশে ও বিশ্বব্যাপী ডেলিভারি",
    footer_gazette_title: "আভরণী বার্তা",
    footer_gazette_desc:
      "নতুন উৎসবের কালেকশন ও তাঁতের রিলিজ সম্পর্কে সরাসরি আপডেট পেতে যোগ দিন।",
    footer_gazette_sub: "সাবস্ক্রাইব",

    // Chatbot / Concierge
    chatbot_launcher_badge: "কনসিয়ার্জকে জিজ্ঞেস করুন",
    chatbot_launcher_sub: "শাড়ি ও তাঁতের তথ্য",
    chatbot_title: "আভরণী কনসিয়ার্জ",
    chatbot_subtitle: "ঢাকা স্টুডিও টেক্সটাইল গাইড",
    chatbot_status: "সক্রিয় আছেন",
    chatbot_greeting_title: "আভরণী মেসনে স্বাগতম",
    chatbot_greeting_desc:
      "নমস্কার। আমি আপনার ব্যক্তিগত টেক্সটাইল কনসিয়ার্জ। আমাদের আসল ঢাকাই জামদানি, রাজশাহী সিল্ক, মিরপুর বিয়ের কাতান, শাড়ির যত্ন, ব্লাউজ পিস বা বনানী স্টুডিওর যেকোনো তথ্য জানতে নির্দ্বিধায় প্রশ্ন করুন।",
    chatbot_quick_questions: "জনপ্রিয় প্রশ্ন ও বিষয়সমূহ",
    chatbot_input_ph: "শাড়ির দাম, বুনন, যত্ন বা ডেলিভারি নিয়ে প্রশ্ন লিখুন...",
    chatbot_send: "পাঠান",
    chatbot_typing: "তাঁত আর্কাইভ থেকে তথ্য খুঁজছি...",
    chatbot_reset: "নতুন করে শুরু করুন",
    chatbot_close: "চ্যাট বন্ধ করুন",
    chatbot_whatsapp_help: "বিশেষ ব্রাইডাল সহায়তার জন্য আমাদের বনানী স্টাইলিস্টের সাথে হোয়াটসঅ্যাপে কথা বলুন",
    chatbot_whatsapp_btn: "হোয়াটসঅ্যাপে স্টাইলিস্ট",
    chatbot_view_product: "শাড়িটি দেখুন",
    chatbot_related_heading: "সম্পর্কিত অন্যান্য বিষয়:",
    chatbot_no_match:
      "আপনার প্রশ্নের হুবহু উত্তরটি আর্কাইভে পাওয়া যায়নি। তবে আমাদের বনানী স্টুডিওর স্টাইলিস্ট সরাসরি আপনাকে যেকোনো তথ্য দিয়ে সহায়তা করবেন।",

    // Maison Trust & Craft Guarantees
    trust_bar_gi_title: "জিআই ও সিল্ক মার্ক সনদপ্রাপ্ত",
    trust_bar_gi_desc: "ইউনেস্কো স্বীকৃত আসল তাঁতের নিশ্চয়তা",
    trust_bar_hemming_title: "ফ্রি ফল ও পিকো ফিনিশিং",
    trust_bar_hemming_desc: "পরার উপযোগী নিখুঁত ফিনিশ অন্তর্ভুক্ত",
    trust_bar_delivery_title: "সারাদেশে এক্সপ্রেস ডেলিভারি",
    trust_bar_delivery_desc: "নিরাপদ হোম ডেলিভারি ও ক্যাশ-অন-ডেলিভারি",
    trust_bar_video_title: "বনানী স্টুডিও ভিডিও কল",
    trust_bar_video_desc: "সরাসরি শাড়ি প্রিভিউ ও কালার ম্যাচিং",

    // Accolades & Social Proof
    accolades_pill: "অভিজাত বধূ ও সংগ্রাহকদের স্বীকৃতি",
    accolades_heading_1: "স্মৃতির সুতোয় বোনা,",
    accolades_heading_2: "প্রজন্মের অমূল্য সম্পদ",
    accolades_subtitle:
      "আমাদের শাড়ির মায়ায় মুগ্ধ প্রিয় বধূ, সংস্কৃতিমনা ব্যক্তিত্ব এবং প্রবাসী বাঙালি সংগ্রাহকদের অকৃত্রিম অনুভূতি।",
    accolades_verified: "ভেরিফাইড আভরণী সংগ্রাহক",
    accolades_view_archive: "সম্পূর্ণ আর্কাইভ দেখুন",

    // Quick Order & Studio Actions
    order_via_whatsapp: "হোয়াটসঅ্যাপে অর্ডার",
    try_in_mirror: "ভার্চুয়াল ট্রায়াল",
    only_one_left: "স্টুডিও আর্কাইভ • মাত্র ১টি পিস উপলব্ধ",
    artisan_crafted: "বংশপরম্পরায় বোনা খাঁটি তাঁত",
    quick_view_title: "শাড়ির বিবরণ ও প্রিভিউ",
    mobile_bar_studio: "ভার্চুয়াল স্টুডিও",
    mobile_bar_chat: "হোয়াটসঅ্যাপ কনসিয়ার্জ",
    quick_order: "ক্যাশ অন ডেলিভারি অর্ডার",
    quick_order_subtitle: "১-ক্লিক সহজ অর্ডার • হাতে পেয়ে মূল্য পরিশোধ করুন",
    customer_name: "আপনার পূর্ণ নাম",
    customer_name_ph: "উদা: নুসরাত জাহান",
    customer_phone: "মোবাইল ফোন নম্বর",
    customer_phone_ph: "০১XXXXXXXXX",
    delivery_address: "সম্পূর্ণ ডেলিভারি ঠিকানা",
    delivery_address_ph: "বাড়ি, রোড, এলাকা, জেলা/থানা...",
    delivery_zone: "ডেলিভারি এলাকা",
    zone_dhaka: "ঢাকার ভিতরে (৳ ৮০ • ২৪-৪৮ ঘণ্টা)",
    zone_outside: "ঢাকার বাইরে (৳ ১৫০ • ২-৪ দিন)",
    zone_free: "ফ্রি এক্সপ্রেস ডেলিভারি (৳ ১০,০০০+)",
    payment_method: "পেমেন্ট মাধ্যম",
    payment_cod: "ক্যাশ অন ডেলিভারি (হাতে পেয়ে পরিশোধ)",
    payment_bkash: "বিকাশ / নগদ (অগ্রিম পেমেন্ট)",
    order_notes: "বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)",
    order_notes_ph: "গিফট বক্স রিকোয়েস্ট, ডেলিভারির সময়...",
    order_summary: "অর্ডার সারাংশ",
    subtotal: "শাড়ির মূল্য",
    delivery_charge: "ডেলিভারি চার্জ",
    total_payable: "সর্বমোট প্রদেয়",
    place_order_btn: "অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)",
    order_submitting: "অর্ডার প্রসেস হচ্ছে...",
    order_success_title: "আপনার অর্ডারটি সফল হয়েছে!",
    order_success_msg: "আমাদের বনানী ঢাকা স্টুডিও থেকে কনসিয়ার্জ কল করে শাড়ি প্যাকেজিং ও ডেলিভারি নিশ্চিত করবেন।",
    order_id: "অর্ডার রেফারেন্স আইডি",
    chat_whatsapp_order: "অর্ডার আইডি দিয়ে হোয়াটসঅ্যাপে চ্যাট করুন",
    continue_shopping: "আরও শাড়ি দেখুন",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Load preferred language from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem("avoroni_lang") as Language;
    if (saved === "bn" || saved === "en") {
      setLanguage(saved);
      document.documentElement.setAttribute("data-lang", saved);
      document.documentElement.setAttribute("lang", saved);
    } else {
      document.documentElement.setAttribute("data-lang", "en");
      document.documentElement.setAttribute("lang", "en");
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("avoroni_lang", lang);
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "bn" : "en";
    handleSetLanguage(next);
  };

  const t = (key: string): string => {
    return DICTIONARY[language][key] || DICTIONARY["en"][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
