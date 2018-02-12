<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>leopard examples</title>
</head>

<body>
  <ul>
    <% for (var i = 0, l = examples.length; i < l; i++) { %>
      <li>
        <a href="/<%= examples[i] %>">
          <%= examples[i] %>
        </a>
      </li>
      <% } %>
  </ul>
</body>

</html>
