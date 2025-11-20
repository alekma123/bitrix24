<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/crmdeal.bundle.css',
	'js' => 'dist/crmdeal.bundle.js',
	'rel' => [
		'main.core',
		'ui.notification',
	],
	'skip_core' => false,
];
