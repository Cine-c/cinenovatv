import SEOHead from '../components/seo/SEOHead';

export default function Oscars2026() {
  return (
    <>
      <SEOHead
        title="98th Academy Awards: All the Winners — CineNovaTV"
        description="The complete winners list from the 98th Academy Awards. One Battle After Another dominates. Sinners makes history. All your Oscars 2026 results."
        url="/oscars-2026"
      />

      <div className="oscars-page">
        {/* HERO */}
        <section className="oscars-hero">
          <div className="oscars-hero-bg" />
          <div className="oscars-year-stamp">98</div>

          <svg className="oscars-silhouette" viewBox="0 0 120 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="32" rx="22" ry="28" fill="#c9a84c"/>
            <rect x="50" y="58" width="20" height="120" rx="2" fill="#c9a84c"/>
            <ellipse cx="60" cy="185" rx="32" ry="12" fill="#c9a84c"/>
            <rect x="35" y="195" width="50" height="18" rx="2" fill="#c9a84c"/>
            <ellipse cx="60" cy="220" rx="38" ry="10" fill="#c9a84c"/>
            <rect x="30" y="228" width="60" height="42" rx="3" fill="#c9a84c"/>
          </svg>

          <div className="oscars-hero-eyebrow">
            <span>98th Academy Awards &nbsp;&middot;&nbsp; March 15, 2026</span>
          </div>

          <h1 className="oscars-hero-title">The Night <em>One Battle</em> Won the War</h1>
          <p className="oscars-hero-sub">
            Paul Thomas Anderson&apos;s epic claims Best Picture while Sinners writes history.
            Every winner from Hollywood&apos;s biggest night &mdash; all in one place.
          </p>

          <div className="oscars-hero-meta">
            <div className="oscars-meta-item">
              <span className="oscars-meta-label">Host</span>
              <span className="oscars-meta-value">Conan O&apos;Brien</span>
            </div>
            <div className="oscars-meta-item">
              <span className="oscars-meta-label">Venue</span>
              <span className="oscars-meta-value">Dolby Theatre, Hollywood</span>
            </div>
            <div className="oscars-meta-item">
              <span className="oscars-meta-label">Big Winner</span>
              <span className="oscars-meta-value">One Battle After Another &mdash; 6 Awards</span>
            </div>
            <div className="oscars-meta-item">
              <span className="oscars-meta-label">Record Nominations</span>
              <span className="oscars-meta-value">Sinners &mdash; 16 Nods</span>
            </div>
          </div>

          <div className="oscars-scroll-hint">
            <span>Scroll</span>
            <div className="oscars-scroll-line" />
          </div>
        </section>

        {/* INTRO */}
        <section className="oscars-intro">
          <div className="oscars-intro-sidebar">
            <div className="oscars-sidebar-label">By the numbers</div>
            <div className="oscars-stat-card">
              <div className="oscars-stat-num">6</div>
              <div className="oscars-stat-desc">Awards for One Battle After Another</div>
            </div>
            <div className="oscars-stat-card">
              <div className="oscars-stat-num">16</div>
              <div className="oscars-stat-desc">Sinners nominations &mdash; a new record</div>
            </div>
            <div className="oscars-stat-card">
              <div className="oscars-stat-num">23</div>
              <div className="oscars-stat-desc">Categories awarded tonight</div>
            </div>
          </div>

          <div className="oscars-intro-body">
            <p>
              The 98th Academy Awards belonged, above all else, to Paul Thomas Anderson. His portrait of aging leftist revolutionaries chased by a brutal military officer &mdash; <em>One Battle After Another</em>, adapted from Thomas Pynchon&apos;s &ldquo;Vineland&rdquo; &mdash; took home six Oscars including Best Picture, Best Director, Best Adapted Screenplay, Best Film Editing, Best Supporting Actor for Sean Penn, and Best Casting. It was a coronation years in the making for a filmmaker many consider the greatest working in American cinema.
            </p>
            <p>
              But the story of the evening can&apos;t be told without Ryan Coogler&apos;s <em>Sinners</em>, the genre-bending vampire saga that arrived with a record-shattering 16 nominations and left with four &mdash; including historic wins for Michael B. Jordan as Best Actor and Autumn Durald Arkapaw as Best Cinematographer, the first woman and first Black cinematographer ever to claim that prize. Jessie Buckley, radiant in Chlo&eacute; Zhao&apos;s <em>Hamnet</em>, claimed Best Actress in what has become one of the award season&apos;s most celebrated performances in years.
            </p>

            <div className="oscars-pull-quote">
              <p>&ldquo;The best part about being on a film crew is being with people, because we need each other.&rdquo; &mdash; Paul Thomas Anderson</p>
            </div>

            <p>
              Guillermo del Toro&apos;s <em>Frankenstein</em> swept the technical and craft categories, claiming Production Design, Costume Design, and Makeup &amp; Hairstyling &mdash; a hat trick that speaks to the film&apos;s extraordinary visual ambition. Meanwhile, the Korean pop animated feature <em>KPop Demon Hunters</em> surprised the room with wins for both Best Animated Feature and Best Original Song for &ldquo;Golden.&rdquo; It was a night of deserved coronations, hard-fought upsets, and at least one tie in the Short Film categories.
            </p>
          </div>
        </section>

        {/* FILM SPOTLIGHT */}
        <div className="oscars-section-header">
          <h2 className="oscars-section-title">Films of the Night</h2>
        </div>
        <section className="oscars-spotlight">
          <div className="oscars-spotlight-grid">
            <div className="oscars-film-card">
              <div className="oscars-film-rank">01</div>
              <div className="oscars-film-title">One Battle After Another</div>
              <div className="oscars-film-director">Dir. Paul Thomas Anderson</div>
              <div className="oscars-film-wins">
                <span className="oscars-win-tag">Best Picture</span>
                <span className="oscars-win-tag">Best Director</span>
                <span className="oscars-win-tag">Adapted Screenplay</span>
                <span className="oscars-win-tag">Film Editing</span>
                <span className="oscars-win-tag">Supporting Actor</span>
                <span className="oscars-win-tag">Best Casting</span>
              </div>
            </div>
            <div className="oscars-film-card">
              <div className="oscars-film-rank">02</div>
              <div className="oscars-film-title">Sinners</div>
              <div className="oscars-film-director">Dir. Ryan Coogler</div>
              <div className="oscars-film-wins">
                <span className="oscars-win-tag">Best Actor</span>
                <span className="oscars-win-tag">Cinematography</span>
                <span className="oscars-win-tag">Original Screenplay</span>
                <span className="oscars-win-tag">Original Score</span>
              </div>
            </div>
            <div className="oscars-film-card">
              <div className="oscars-film-rank">03</div>
              <div className="oscars-film-title">Frankenstein</div>
              <div className="oscars-film-director">Dir. Guillermo del Toro</div>
              <div className="oscars-film-wins">
                <span className="oscars-win-tag">Production Design</span>
                <span className="oscars-win-tag">Costume Design</span>
                <span className="oscars-win-tag">Makeup &amp; Hairstyling</span>
              </div>
            </div>
            <div className="oscars-film-card">
              <div className="oscars-film-rank">04</div>
              <div className="oscars-film-title">Hamnet</div>
              <div className="oscars-film-director">Dir. Chlo&eacute; Zhao</div>
              <div className="oscars-film-wins">
                <span className="oscars-win-tag">Best Actress</span>
              </div>
            </div>
            <div className="oscars-film-card">
              <div className="oscars-film-rank">05</div>
              <div className="oscars-film-title">KPop Demon Hunters</div>
              <div className="oscars-film-director">Dir. Maggie Kang &amp; Chris Appelhans</div>
              <div className="oscars-film-wins">
                <span className="oscars-win-tag">Animated Feature</span>
                <span className="oscars-win-tag">Original Song</span>
              </div>
            </div>
            <div className="oscars-film-card">
              <div className="oscars-film-rank">06</div>
              <div className="oscars-film-title">Avatar: Fire and Ash</div>
              <div className="oscars-film-director">Dir. James Cameron</div>
              <div className="oscars-film-wins">
                <span className="oscars-win-tag">Visual Effects</span>
              </div>
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="oscars-divider">
          <span className="oscars-divider-icon">&#10022; Complete Winners &#10022;</span>
        </div>

        {/* ALL WINNERS */}
        <div className="oscars-section-header" style={{ paddingBottom: '1.5rem' }}>
          <h2 className="oscars-section-title">All 2026 Oscar Winners</h2>
        </div>

        <div className="oscars-winners-grid">
          {/* Best Picture - Featured */}
          <div className="oscars-award-card oscars-featured">
            <div className="oscars-award-category">&#9733; Best Picture</div>
            <div className="oscars-award-winner">One Battle After Another</div>
            <div className="oscars-award-film">Paul Thomas Anderson, Director</div>
            <div className="oscars-award-note">Anderson&apos;s Pynchon adaptation beats Sinners and eight other contenders for cinema&apos;s highest honour, ending a decades-long Best Director wait for PTA.</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Director</div>
            <div className="oscars-award-winner">Paul Thomas Anderson</div>
            <div className="oscars-award-film">One Battle After Another</div>
            <div className="oscars-award-note">A long-overdue win after previous nominations for There Will Be Blood, Phantom Thread, and Licorice Pizza.</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Actress</div>
            <div className="oscars-award-winner">Jessie Buckley</div>
            <div className="oscars-award-film">Hamnet</div>
            <div className="oscars-award-note">Buckley swept the season in Chlo&eacute; Zhao&apos;s Shakespearean drama, portraying Agnes Hathaway with unforgettable precision.</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Actor</div>
            <div className="oscars-award-winner">Michael B. Jordan</div>
            <div className="oscars-award-film">Sinners</div>
            <div className="oscars-award-note">First Oscar win for Jordan in Ryan Coogler&apos;s vampire epic that shattered nomination records.</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Supporting Actor</div>
            <div className="oscars-award-winner">Sean Penn</div>
            <div className="oscars-award-film">One Battle After Another</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Supporting Actress</div>
            <div className="oscars-award-winner">Amy Madigan</div>
            <div className="oscars-award-film">Weapons</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Original Screenplay</div>
            <div className="oscars-award-winner">Ryan Coogler</div>
            <div className="oscars-award-film">Sinners</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Adapted Screenplay</div>
            <div className="oscars-award-winner">Paul Thomas Anderson</div>
            <div className="oscars-award-film">One Battle After Another</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Cinematography</div>
            <div className="oscars-award-winner">Autumn Durald Arkapaw</div>
            <div className="oscars-award-film">Sinners</div>
            <div className="oscars-award-note">Historic double first &mdash; first woman and first Black cinematographer to win this award. Asked all the women in the room to stand with her.</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Original Score</div>
            <div className="oscars-award-winner">Ludwig G&ouml;ransson</div>
            <div className="oscars-award-film">Sinners</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Film Editing</div>
            <div className="oscars-award-winner">Andy Jurgensen</div>
            <div className="oscars-award-film">One Battle After Another</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Sound</div>
            <div className="oscars-award-winner">Gareth John, Al Nelson &amp; Team</div>
            <div className="oscars-award-film">F1</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Production Design</div>
            <div className="oscars-award-winner">Tamara Deverell &amp; Shane Vieau</div>
            <div className="oscars-award-film">Frankenstein</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Costume Design</div>
            <div className="oscars-award-winner">Kate Hawley</div>
            <div className="oscars-award-film">Frankenstein</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Makeup &amp; Hairstyling</div>
            <div className="oscars-award-winner">Mike Hill, Jordan Samuel &amp; Cliona Furey</div>
            <div className="oscars-award-film">Frankenstein</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Visual Effects</div>
            <div className="oscars-award-winner">Joe Letteri, Richard Baneham &amp; Team</div>
            <div className="oscars-award-film">Avatar: Fire and Ash</div>
            <div className="oscars-award-note">Richard Baneham&apos;s third Oscar in the category, having previously won for both Avatar films.</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Animated Feature</div>
            <div className="oscars-award-winner">KPop Demon Hunters</div>
            <div className="oscars-award-film">Dir. Maggie Kang &amp; Chris Appelhans</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best International Feature</div>
            <div className="oscars-award-winner">Sentimental Value</div>
            <div className="oscars-award-film">Norway &mdash; Dir. Joachim Trier</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Original Song</div>
            <div className="oscars-award-winner">&ldquo;Golden&rdquo;</div>
            <div className="oscars-award-film">KPop Demon Hunters</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Documentary Feature</div>
            <div className="oscars-award-winner">Mr. Nobody Against Putin</div>
            <div className="oscars-award-film">Dir. David Borenstein</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Casting (New Category)</div>
            <div className="oscars-award-winner">Cassandra Kulukundis</div>
            <div className="oscars-award-film">One Battle After Another</div>
            <div className="oscars-award-note">Presented by Paul Mescal &mdash; Casting makes its debut as an official Oscar category this year.</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Animated Short</div>
            <div className="oscars-award-winner">The Girl Who Cried Pearls</div>
            <div className="oscars-award-film">Chris Lavis &amp; Maciek Szczerbowski</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Live Action Short</div>
            <div className="oscars-award-winner">The Singers / Two People Exchanging Saliva</div>
            <div className="oscars-award-film">TIE &mdash; co-winners</div>
            <div className="oscars-award-note">A rare tie. &ldquo;Two People&rdquo; director Alexandre Singh noted the film had been reviewed by Charli xcx on Letterboxd as his highlight of the campaign.</div>
          </div>

          <div className="oscars-award-card">
            <div className="oscars-award-category">Best Documentary Short</div>
            <div className="oscars-award-winner">All The Empty Rooms</div>
            <div className="oscars-award-film">Joshua Seftel &amp; Conall Jones</div>
          </div>
        </div>

        {/* HISTORIC MOMENTS */}
        <div className="oscars-divider" style={{ marginTop: '2rem' }}>
          <span className="oscars-divider-icon">&#10022; Night to Remember &#10022;</span>
        </div>
        <section className="oscars-moments">
          <div className="oscars-moments-inner">
            <h2 className="oscars-section-title">Five Defining Moments</h2>
            <div className="oscars-moments-list">
              <div className="oscars-moment-item">
                <span className="oscars-moment-num">01</span>
                <div className="oscars-moment-text">
                  <strong>History in the Light &mdash; Autumn Durald Arkapaw</strong>
                  <p>When Arkapaw walked to the podium for Best Cinematography, she became the first woman and the first Black cinematographer to win the award in Oscar history. Her words &mdash; asking every woman in the Dolby Theatre to stand with her &mdash; turned a technical award into one of the night&apos;s most powerful moments.</p>
                </div>
              </div>
              <div className="oscars-moment-item">
                <span className="oscars-moment-num">02</span>
                <div className="oscars-moment-text">
                  <strong>PTA&apos;s Long Overdue Crown</strong>
                  <p>Paul Thomas Anderson had previously been nominated for directing There Will Be Blood, Phantom Thread, and Licorice Pizza &mdash; and never won. Tonight, finally, the industry&apos;s top directing prize arrived alongside a second statuette for Adapted Screenplay. Few standing ovations in recent Oscar history felt more earned.</p>
                </div>
              </div>
              <div className="oscars-moment-item">
                <span className="oscars-moment-num">03</span>
                <div className="oscars-moment-text">
                  <strong>Sinners&apos; Record Run Falls Short of the Top</strong>
                  <p>Ryan Coogler&apos;s vampire epic arrived with 16 nominations &mdash; a new all-time record &mdash; and left with four wins. Falling just short of Best Picture, Sinners still proved itself one of the defining films of the year, with history-making performances and a score that dominated the season.</p>
                </div>
              </div>
              <div className="oscars-moment-item">
                <span className="oscars-moment-num">04</span>
                <div className="oscars-moment-text">
                  <strong>Frankenstein&apos;s Technical Sweep</strong>
                  <p>Guillermo del Toro&apos;s long-gestating monster film took no prizes in the major categories but cleaned up on craft, winning Costume Design, Makeup &amp; Hairstyling, and Production Design. A reminder that sometimes the most immersive films are built from the ground up.</p>
                </div>
              </div>
              <div className="oscars-moment-item">
                <span className="oscars-moment-num">05</span>
                <div className="oscars-moment-text">
                  <strong>A New Category Arrives: Best Casting</strong>
                  <p>The Academy formally recognised casting directors for the first time, awarding Cassandra Kulukundis for One Battle After Another. The award was presented by Paul Mescal, who starred in Hamnet. A long-overdue acknowledgement of a craft that shapes every film before a single frame is shot.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
