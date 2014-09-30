---
---

{% for post in site.posts %}
* _{{page.date | date_to_string}}_ -- [{{post.title}}]({{post.url}})
{% endfor %}
