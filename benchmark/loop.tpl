<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>loop</title>
</head>

<body>
  <ul>
    <% for (var i = 0; i < times; i++) { %>
    <li>
      This is <%= name %>
    </li>
    <% } %>
  </ul>
</body>

</html>
