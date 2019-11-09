# trying various options for crossorigin attribute

HTML 5 has has introduced a CORS attribute for script tag. When this attribute
`crossorigin` is set anonymous, CORS is honoured and no cookies/credentials are
sent to server.

When set to use-credentials, the cookies or other credentials will be sent to
server.

## Experiment.
This server hosts two services on port 3000 and 30001. Configure localhost to
a.com, b.com in /etc/hosts.

b.com:3001 is attacker site, when it loads the original javascript from
a.com:3000/profilejs, how the crossorigin attribute behaves. 

To make it interesting, a.com:3000/profilejs will have variable involving the
calling user's sample salary information. The user is assumed authenticated
based on the session cookie set after /login. 

This also checks how window.onerror behaves across two javascript bundles when
this `crossorigin` is set.
