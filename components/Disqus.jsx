import { useEffect } from 'react';

export default function Disqus({ identifier, title, url }) {
  useEffect(() => {
    // Reset Disqus if it's already loaded
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function() {
          this.page.identifier = identifier;
          this.page.url = url;
          this.page.title = title;
        }
      });
      return;
    }

    // Load Disqus
    window.disqus_config = function() {
      this.page.url = url;
      this.page.identifier = identifier;
      this.page.title = title;
    };

    const script = document.createElement('script');
    script.src = 'https://cinenovatv.disqus.com/embed.js';
    script.setAttribute('data-timestamp', +new Date());
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const disqusThread = document.getElementById('disqus_thread');
      if (disqusThread) {
        disqusThread.innerHTML = '';
      }
    };
  }, [identifier, title, url]);

  return (
    <div className="disqus-container">
      <div className="disqus-header">
        <h3>Comments</h3>
        <p>Join the discussion</p>
      </div>
      <div id="disqus_thread"></div>
      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
      </noscript>
    </div>
  );
}
