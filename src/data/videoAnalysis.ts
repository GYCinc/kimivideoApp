import type { VideoAnalysis } from '@/types/pedagogy';

/**
 * Realistic 3-Minute Business English Video Analysis
 * Topic: "Negotiating International Contracts"
 * 
 * Segmentation follows computational discourse analysis:
 * - Prosodic boundaries (pauses ≥1.5s)
 * - Semantic coherence (one idea per segment)
 * - Pedagogical digestibility (45-90 second segments)
 * - Structural markers (transition phrases)
 */

export const businessEnglishVideo: VideoAnalysis = {
  metadata: {
    title: "Mastering International Contract Negotiations",
    duration_seconds: 184.7,
    source_url: "https://example.com/business-negotiation-video",
    thumbnail: "/thumbnail.jpg"
  },

  difficulty_profile: {
    overall_cefr: "B2",
    overall_score: 68,
    lexical_sophistication: 0.71,
    syntactic_complexity: "moderate_high",
    complexity_metrics: {
      lexical_density: 0.73,
      awl_ratio: 0.18,
      mean_sentence_length: 19.2,
      type_token_ratio: 0.67
    },
    recommendations: {
      target_audience: "Upper-intermediate business professionals and MBA students",
      prerequisite_knowledge: [
        "basic_contract_terminology",
        "present_perfect",
        "conditional_sentences"
      ]
    }
  },

  segments: [
    {
      id: "seg_001",
      time_bounds: { start: 0.0, end: 52.4 },
      transcript: "Welcome to today's session on international contract negotiations. When you're dealing with cross-border agreements, the stakes are considerably higher than domestic deals. You're not just navigating different legal frameworks—you're bridging cultural expectations that can make or break a partnership. Let me share a scenario from a recent negotiation I facilitated between a German manufacturer and a South Korean distributor.",
      segmentation_rationale: "structural_marker",
      lexical_density_score: 0.68,
      speech_rate_wpm: 142,
      segment_difficulty: {
        cefr: "B1",
        complexity_factors: ["technical_terminology", "compound_sentences"],
        comprehension_checkpoints: ["main_topic", "stake_comparison"]
      },
      pedagogical_focus: "introduction_to_international_negotiations"
    },
    {
      id: "seg_002",
      time_bounds: { start: 52.4, end: 98.7 },
      transcript: "The German side came in with what they considered a straightforward proposal—fixed pricing for twelve months with quarterly reviews. But the Korean team had a fundamentally different approach. They expected a more fluid arrangement, something that could adapt to market fluctuations without renegotiating the entire contract. This divergence wasn't just about pricing strategy; it reflected deeper cultural attitudes toward flexibility and commitment.",
      segmentation_rationale: "topic_shift",
      lexical_density_score: 0.74,
      speech_rate_wpm: 148,
      segment_difficulty: {
        cefr: "B2",
        complexity_factors: ["cultural_schema", "abstract_concepts", "nominalization"],
        comprehension_checkpoints: ["contrast_identification", "cultural_implication"]
      },
      pedagogical_focus: "cultural_divergence_in_negotiation"
    },
    {
      id: "seg_003",
      time_bounds: { start: 98.7, end: 141.2 },
      transcript: "Now, here's where most negotiators go wrong. They try to push their preferred structure immediately, creating friction before trust is established. What we did instead was implement a phased approach. Phase one focused on establishing mutual understanding of each party's underlying interests—not positions, but interests. The Germans needed cost predictability for their forecasting. The Koreans needed flexibility to remain competitive in a volatile market.",
      segmentation_rationale: "pause_boundary",
      lexical_density_score: 0.76,
      speech_rate_wpm: 151,
      segment_difficulty: {
        cefr: "B2",
        complexity_factors: ["fast_speech_rate", "technical_terminology", "implied_meaning"],
        comprehension_checkpoints: ["problem_identification", "solution_approach"]
      },
      pedagogical_focus: "interest_based_negotiation"
    },
    {
      id: "seg_004",
      time_bounds: { start: 141.2, end: 184.7 },
      transcript: "The breakthrough came when we introduced a variable pricing mechanism with capped fluctuations. This hybrid model gave the Germans their forecasting stability while allowing the Koreans enough room to maneuver. The key takeaway here is that successful international negotiations aren't about winning—they're about architecting solutions that address the legitimate concerns of all parties. Remember, you're building a relationship, not just closing a transaction.",
      segmentation_rationale: "semantic_boundary",
      lexical_density_score: 0.72,
      speech_rate_wpm: 139,
      segment_difficulty: {
        cefr: "C1",
        complexity_factors: ["metaphorical_language", "complex_syntax", "idiomatic_expressions"],
        comprehension_checkpoints: ["solution_details", "key_takeaway"]
      },
      pedagogical_focus: "creative_problem_solving"
    }
  ],

  vocabulary_items: [
    {
      term: "cross-border",
      segment_id: "seg_001",
      timestamp_occurrence: 12.3,
      frequency_band: "AWL",
      cefr_level: "B2",
      deductive_context: "The speaker contrasts 'cross-border agreements' with 'domestic deals,' suggesting it involves different countries or nations.",
      full_definition: "Involving two or more countries; extending across national boundaries.",
      collocations: ["cross-border trade", "cross-border investment", "cross-border collaboration"],
      pronunciation: "/ˈkrɒsˈbɔːrdər/"
    },
    {
      term: "make or break",
      segment_id: "seg_001",
      timestamp_occurrence: 28.7,
      frequency_band: "K2",
      cefr_level: "B1",
      deductive_context: "The phrase is used to describe how cultural expectations can determine the success or failure of a partnership.",
      full_definition: "To be the deciding factor in whether something succeeds or fails completely.",
      collocations: ["make-or-break moment", "make-or-break decision"],
      pronunciation: "/meɪk ɔːr breɪk/"
    },
    {
      term: "facilitated",
      segment_id: "seg_001",
      timestamp_occurrence: 42.1,
      frequency_band: "AWL",
      cefr_level: "B2",
      deductive_context: "The speaker mentions facilitating a negotiation between two parties, implying they helped make the process easier or smoother.",
      full_definition: "To make a process or activity easier, smoother, or more likely to happen successfully.",
      collocations: ["facilitate communication", "facilitate learning", "facilitate discussion"],
      pronunciation: "/fəˈsɪlɪteɪtɪd/"
    },
    {
      term: "fundamentally",
      segment_id: "seg_002",
      timestamp_occurrence: 68.4,
      frequency_band: "AWL",
      cefr_level: "B2",
      deductive_context: "Used to emphasize that the Korean team's approach was completely or essentially different from the German approach.",
      full_definition: "In a way that affects the foundation or central nature of something; essentially or completely.",
      collocations: ["fundamentally different", "fundamentally change", "fundamentally flawed"],
      pronunciation: "/ˌfʌndəˈmentəli/"
    },
    {
      term: "fluid",
      segment_id: "seg_002",
      timestamp_occurrence: 75.9,
      frequency_band: "K2",
      cefr_level: "B2",
      deductive_context: "Contrasted with 'fixed pricing,' suggesting something that can change or adapt rather than staying constant.",
      full_definition: "Able to change or adapt easily; not fixed or rigid.",
      collocations: ["fluid situation", "fluid arrangement", "fluid dynamics"],
      pronunciation: "/ˈfluːɪd/"
    },
    {
      term: "divergence",
      segment_id: "seg_002",
      timestamp_occurrence: 84.2,
      frequency_band: "AWL",
      cefr_level: "C1",
      deductive_context: "Refers to the difference or separation between the two teams' approaches to the contract.",
      full_definition: "The process or state of separating or becoming different; a difference in opinion or approach.",
      collocations: ["growing divergence", "cultural divergence", "divergence of opinion"],
      pronunciation: "/daɪˈvɜːrdʒəns/"
    },
    {
      term: "friction",
      segment_id: "seg_003",
      timestamp_occurrence: 108.6,
      frequency_band: "K2",
      cefr_level: "B2",
      deductive_context: "Describes the conflict or tension that occurs when negotiators push their preferences before establishing trust.",
      full_definition: "Conflict or tension between people or groups with different views; resistance or disagreement.",
      collocations: ["create friction", "reduce friction", "friction between"],
      pronunciation: "/ˈfrɪkʃn/"
    },
    {
      term: "phased approach",
      segment_id: "seg_003",
      timestamp_occurrence: 118.3,
      frequency_band: "AWL",
      cefr_level: "B2",
      deductive_context: "Describes a method that proceeds in stages or phases rather than all at once.",
      full_definition: "A method of doing something that proceeds step by step through distinct stages or phases.",
      collocations: ["phased implementation", "phased rollout", "phased transition"],
      pronunciation: "/feɪzd əˈproʊtʃ/"
    },
    {
      term: "underlying",
      segment_id: "seg_003",
      timestamp_occurrence: 128.7,
      frequency_band: "AWL",
      cefr_level: "B2",
      deductive_context: "Distinguishes between surface 'positions' and deeper 'interests' in negotiation terminology.",
      full_definition: "Existing beneath the surface or at a deeper level; fundamental but not immediately obvious.",
      collocations: ["underlying cause", "underlying principle", "underlying assumption"],
      pronunciation: "/ˌʌndərˈlaɪɪŋ/"
    },
    {
      term: "forecasting",
      segment_id: "seg_003",
      timestamp_occurrence: 136.4,
      frequency_band: "AWL",
      cefr_level: "B2",
      deductive_context: "The Germans needed predictability for their business planning and predicting future financial outcomes.",
      full_definition: "The process of predicting or estimating future trends, events, or outcomes based on current data.",
      collocations: ["financial forecasting", "sales forecasting", "demand forecasting"],
      pronunciation: "/ˈfɔːrkæstɪŋ/"
    },
    {
      term: "breakthrough",
      segment_id: "seg_004",
      timestamp_occurrence: 145.8,
      frequency_band: "K2",
      cefr_level: "B1",
      deductive_context: "Refers to the important discovery or development that helped solve the negotiation problem.",
      full_definition: "An important discovery or development that helps solve a problem or overcome a difficulty.",
      collocations: ["major breakthrough", "scientific breakthrough", "breakthrough moment"],
      pronunciation: "/ˈbreɪkθruː/"
    },
    {
      term: "capped",
      segment_id: "seg_004",
      timestamp_occurrence: 156.3,
      frequency_band: "K2",
      cefr_level: "B2",
      deductive_context: "Describes fluctuations that have an upper limit or maximum, providing the stability the Germans needed.",
      full_definition: "Having an upper limit or maximum; restricted to a certain level.",
      collocations: ["capped at", "price-capped", "capped spending"],
      pronunciation: "/kæpt/"
    },
    {
      term: "hybrid model",
      segment_id: "seg_004",
      timestamp_occurrence: 159.1,
      frequency_band: "AWL",
      cefr_level: "B2",
      deductive_context: "A combination of two different approaches—fixed pricing and variable pricing—merged together.",
      full_definition: "A system or approach that combines elements from two or more different sources or methods.",
      collocations: ["hybrid approach", "hybrid system", "hybrid solution"],
      pronunciation: "/ˈhaɪbrɪd ˈmɒdl/"
    },
    {
      term: "architecting",
      segment_id: "seg_004",
      timestamp_occurrence: 171.4,
      frequency_band: "low_freq",
      cefr_level: "C1",
      deductive_context: "Used metaphorically to describe carefully designing or constructing solutions, like an architect designs buildings.",
      full_definition: "To design or create something complex and carefully structured; to plan and organize systematically.",
      collocations: ["architecting solutions", "architecting systems", "architecting strategy"],
      pronunciation: "/ˈɑːrkɪtektɪŋ/"
    }
  ],

  phrasal_verbs: [
    {
      verb: "bridge",
      meaning: "To connect or reduce the gap between two different things, groups, or ideas",
      example: "You're bridging cultural expectations that can make or break a partnership.",
      segment_id: "seg_001"
    },
    {
      verb: "come in with",
      meaning: "To enter a situation with a particular attitude, proposal, or approach",
      example: "The German side came in with what they considered a straightforward proposal.",
      segment_id: "seg_002"
    },
    {
      verb: "go wrong",
      meaning: "To make a mistake; to fail or not proceed as intended",
      example: "Here's where most negotiators go wrong.",
      segment_id: "seg_003"
    },
    {
      verb: "push through",
      meaning: "To force something to be accepted or implemented despite resistance",
      example: "They try to push their preferred structure immediately.",
      segment_id: "seg_003"
    },
    {
      verb: "maneuver",
      meaning: "To move or act skillfully and carefully to achieve an advantage",
      example: "Allowing the Koreans enough room to maneuver.",
      segment_id: "seg_004"
    }
  ],

  exercises: {
    segment_specific: [
      {
        segment_id: "seg_001",
        exercise_type: "gap_fill",
        items: [
          {
            id: "ex_001_1",
            question: "When dealing with __________ agreements, the stakes are considerably higher than domestic deals.",
            answer: "cross-border",
            context: "The speaker emphasizes the increased complexity of international versus domestic negotiations."
          },
          {
            id: "ex_001_2",
            question: "Cultural expectations can __________ a partnership—either leading to success or failure.",
            answer: "make or break",
            context: "Understanding cultural differences is crucial for partnership success."
          }
        ]
      },
      {
        segment_id: "seg_002",
        exercise_type: "matching",
        items: [
          {
            id: "ex_002_1",
            question: "Match the term with its definition: 'fundamentally different'",
            answer: "Completely or essentially different at the core",
            options: ["Slightly different in appearance", "Completely or essentially different at the core", "Temporarily different"]
          },
          {
            id: "ex_002_2",
            question: "What does 'fluid arrangement' mean in this context?",
            answer: "A flexible agreement that can adapt to changes",
            options: ["A fixed and rigid contract", "A flexible agreement that can adapt to changes", "A liquid financial instrument"]
          }
        ]
      },
      {
        segment_id: "seg_003",
        exercise_type: "categorization",
        items: [
          {
            id: "ex_003_1",
            question: "Categorize these as either 'Positions' or 'Interests': Cost predictability for forecasting",
            answer: "Interests",
            context: "The Germans' underlying need was cost predictability, not just a fixed price."
          },
          {
            id: "ex_003_2",
            question: "Categorize these as either 'Positions' or 'Interests': Fixed pricing for twelve months",
            answer: "Positions",
            context: "This was the German team's stated position, not their underlying interest."
          }
        ]
      },
      {
        segment_id: "seg_004",
        exercise_type: "discourse_analysis",
        items: [
          {
            id: "ex_004_1",
            question: "What metaphor does the speaker use to describe creating solutions?",
            answer: "Architecting",
            context: "The speaker uses architectural language to emphasize careful, structured solution design."
          },
          {
            id: "ex_004_2",
            question: "What is the key takeaway about successful international negotiations?",
            answer: "Building relationships, not just closing transactions",
            context: "The speaker emphasizes relationship-building over transactional victory."
          }
        ]
      }
    ],
    global_review: {
      categorization_tasks: [
        {
          id: "global_cat_1",
          question: "Sort these vocabulary items by CEFR level: cross-border, divergence, architecting",
          answer: "B1: cross-border | B2: divergence | C1: architecting",
          options: ["B1: cross-border", "B2: divergence", "C1: architecting"]
        }
      ],
      matching_sets: [
        {
          id: "global_match_1",
          question: "Match the collocation: 'phased __________'",
          answer: "approach",
          options: ["approach", "method", "system", "technique"]
        },
        {
          id: "global_match_2",
          question: "Match the collocation: '__________ fluctuations'",
          answer: "capped",
          options: ["capped", "limited", "controlled", "restricted"]
        }
      ]
    }
  }
};

export default businessEnglishVideo;
