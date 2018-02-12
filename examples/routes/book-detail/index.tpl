<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>detail</title>
</head>

<body>
  <div id="app">
  	<div>
  		<img alt="<%= alt_title %>" src="<%= image %>" />
  		<h3><a href="<%= alt %>"><%= title %></a></h3>
  		<p><%= summary %></p>
  		<p>信息：</p>
  		<ul>
  			<% for (var attr in attrs) { %>
  			<li><%= attrs[attr] %></li>
  			<% } %>
  		</ul>
  		<p>标签：</p>
  		<ol>
  			<% for (var i = 0; i < tags.length; i++) { %>
  			<li><%= tags[i].name %></li>
  			<% } %>
  		</ol>
  	</div>
  </div>
</body>

</html>
