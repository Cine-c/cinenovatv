import SEOHead from '../../components/seo/SEOHead';
import AdSlot from '../../components/AdSlot';

export default function Cinematography() {
  return (
    <>
      <SEOHead
        title="Cinematography"
        description="Explore how directors of photography create visual magic through lighting, framing, lenses, and camera movement."
        url="/academy/cinematography"
      />

      <div className="academy-page">
        <header className="academy-hero">
          <div className="academy-hero-glow"></div>
          <div className="academy-hero-overlay"></div>
          <div className="academy-hero-content">
            <div className="academy-genre-tag">Visual Language &middot; Light &middot; Composition &middot; Education</div>
            <h1><span>Cinematography</span></h1>
            <div className="academy-hero-sub">CineNovaTV &nbsp;&middot;&nbsp; Film Academy Series</div>
            <p className="academy-hero-tagline">Every frame is a decision. Every shadow tells a story.</p>
          </div>
        </header>

        <div className="academy-meta-bar">
          <div className="academy-meta-item"><span className="academy-meta-label">Series</span><span className="academy-meta-value">Film Academy</span></div>
          <div className="academy-meta-item"><span className="academy-meta-label">Focus</span><span className="academy-meta-value">Lighting &middot; Framing &middot; Lenses &middot; Camera Movement</span></div>
          <div className="academy-meta-item"><span className="academy-meta-label">Level</span><span className="academy-meta-value">Beginner to Advanced</span></div>
          <div className="academy-meta-item"><span className="academy-meta-label">Format</span><span className="academy-meta-value">Deep Dive &middot; Visual Analysis &middot; Technique Breakdown</span></div>
        </div>

        <main className="academy-wrap">
          <article className="academy-article">
            <p className="academy-intro">Before a single line of dialogue is spoken, a cinematographer has already told you how to feel. Through light, shadow, depth, and movement &mdash; the director of photography is the film&rsquo;s silent co-author, shaping every emotional beat with a vocabulary most audiences absorb without ever knowing it exists.</p>

            <h2>The Language of Light</h2>
            <p>Cinematography begins with light &mdash; its presence, its absence, and the infinite gradations between. Gordon Willis, nicknamed &ldquo;the Prince of Darkness,&rdquo; shot The Godfather with such dramatic underexposure that Paramount executives demanded reshoots, convinced the film was technically defective. It was a masterpiece. Willis understood that what you hide from the audience can be more powerful than what you show &mdash; that shadow is not the absence of story but story itself.</p>
            <p>High-key lighting bathes a scene in even, forgiving illumination &mdash; the grammar of romantic comedies and procedural drama. Low-key lighting, with its dramatic contrasts and deep blacks, belongs to noir, thriller, tragedy. But the most sophisticated cinematographers resist categories. Roger Deakins will flood a prison yard with natural grey overcast light and make it feel like a painting; Emmanuel Lubezki will chase the golden hour for six minutes every evening to make a film feel like a memory of something real.</p>

            <div className="academy-pq">
              <p>&ldquo;I try to photograph people thinking. I try to photograph thought.&rdquo;</p>
              <cite>&mdash; Gordon Willis, ASC</cite>
            </div>

            <h2>Framing as Meaning</h2>
            <p>Where you place the camera &mdash; and what you choose to include in the frame &mdash; is an act of interpretation. A character centered in a wide, empty frame communicates isolation. A tight close-up that cuts off the top of the head creates claustrophobia and psychological pressure. The rule of thirds, the golden ratio, negative space &mdash; these aren&rsquo;t academic constraints but tools of emotional precision.</p>
            <p>Stanley Kubrick used symmetrical, centered compositions to create a sense of cold inevitability &mdash; characters trapped in perfectly organized worlds they cannot escape. Paul Thomas Anderson shoots scenes from unexpected angles that feel slightly wrong, slightly off-balance &mdash; mirroring the psychologies of his characters. Every compositional choice is an argument about the nature of the world you&rsquo;re depicting.</p>

            <div className="academy-pq">
              <p>&ldquo;The camera is always moving emotionally, even when it&rsquo;s standing still.&rdquo;</p>
              <cite>&mdash; Emmanuel Lubezki, ASC, AMC</cite>
            </div>

            <h2>Lenses, Movement, and the Grammar of Cinema</h2>
            <p>A wide-angle lens exaggerates depth and makes space feel expansive and distorted &mdash; perfect for Kubrick&rsquo;s corridors or Orson Welles&rsquo; ceilings. A telephoto lens compresses space, flattening the relationship between foreground and background, making characters feel surveilled, watched, hunted. The Vertigo effect &mdash; simultaneously zooming in and tracking out &mdash; creates a disorientation that language cannot replicate.</p>
            <p>Camera movement carries its own syntax. A slow push-in communicates dawning realization; a rapid zoom, shock or recognition; a handheld follow-shot, immediacy and chaos; a long, slow crane pull-back, the diminishment of a human being against the indifferent scale of the world. Roger Deakins&rsquo; virtuoso unbroken tracking shot through a World War I battlefield in 1917 is not a technical exercise &mdash; it is empathy engineered into motion.</p>

            <h2>The Digital Revolution</h2>
            <p>The shift from celluloid to digital fundamentally transformed what cinematography can do &mdash; and what it must decide. Film grain, lens flare, the organic imperfection of 35mm &mdash; these were once limitations that became beloved textures. Digital cinematography offers control the old masters couldn&rsquo;t imagine, but with it comes the burden of choice. The best modern DPs use digital tools in service of an analog feeling &mdash; chasing warmth, texture, and imperfection in a medium that is, by nature, mathematically precise.</p>

            <div className="academy-verdict">
              <div className="academy-verdict-lbl">The Takeaway</div>
              <p>Cinematography is the art of making the invisible felt. It operates entirely below the threshold of conscious observation for most viewers &mdash; which is, of course, the point. When the work is truly great, you don&rsquo;t see the camera. You simply feel what it wants you to feel, and you have no idea why.</p>
            </div>
            <AdSlot />
          </article>

          <aside className="academy-sidebar">
            <div className="academy-sc">
              <h3>Legendary DPs</h3>
              <div className="academy-cast-item"><span>Roger Deakins</span><span className="academy-cast-role">Blade Runner 2049</span></div>
              <div className="academy-cast-item"><span>Gordon Willis</span><span className="academy-cast-role">The Godfather</span></div>
              <div className="academy-cast-item"><span>Emmanuel Lubezki</span><span className="academy-cast-role">The Revenant</span></div>
              <div className="academy-cast-item"><span>Vilmos Zsigmond</span><span className="academy-cast-role">McCabe &amp; Mrs. Miller</span></div>
              <div className="academy-cast-item"><span>Hoyte van Hoytema</span><span className="academy-cast-role">Oppenheimer</span></div>
            </div>
            <div className="academy-sc">
              <h3>Core Concepts</h3>
              <div className="academy-detail-row"><span className="academy-detail-key">Exposure</span><span>Light Ratio &amp; Stop Control</span></div>
              <div className="academy-detail-row"><span className="academy-detail-key">Composition</span><span>Framing &amp; Negative Space</span></div>
              <div className="academy-detail-row"><span className="academy-detail-key">Optics</span><span>Focal Length &amp; Depth of Field</span></div>
              <div className="academy-detail-row"><span className="academy-detail-key">Movement</span><span>Dolly, Crane, Handheld</span></div>
              <div className="academy-detail-row"><span className="academy-detail-key">Colour</span><span>Grading &amp; Temperature</span></div>
            </div>
            <div className="academy-sc">
              <h3>Tags</h3>
              <div className="academy-tags-row">
                <span className="academy-tag">LIGHTING</span>
                <span className="academy-tag">FRAMING</span>
                <span className="academy-tag">LENSES</span>
                <span className="academy-tag">VISUAL CRAFT</span>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </>
  );
}
