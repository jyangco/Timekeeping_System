<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>HRMU Timekeeping System</title>
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"/>
        <script src="https://cdn.tailwindcss.com"></script>
        @viteReactRefresh
        @vite('resources/js/app.js')
        @vite('resources/css/app.css')
    </head>
    <body class="antialiased">
        <did id="app">
        </did>
    </body>
</html>
