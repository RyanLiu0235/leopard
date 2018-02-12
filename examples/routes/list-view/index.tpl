<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>list view</title>
</head>

<body>
  <div id="app">
    <ul style="float:left;">
      <% for (var i = 0; i < 20; i++) { %>
      <li><%= i %>: I am <%= name %>!</li>
      <% } %>
    </ul>
    <ul style="float:left;">
      <% for (var i = 0; i < 20; i++) { %>
      <li><%= i %>: I am <%- name | capitalize %>!</li>
      <% } %>
    </ul>
  </div>
</body>

</html>
