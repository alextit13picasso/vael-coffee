'use strict';
/* global monogatari */

monogatari.settings({
	'Name': 'Vael: Принесли кофе',
	'Version': '1.0.0',
	'Label': 'Start',
	'Slots': 10,
	'MultiLanguage': false,
	'LanguageSelectionScreen': false, // Выключаем лишнее окно выбора языка на старте
	'MainScreenMusic': '',
	'SaveLabel': 'Сохранить',
	'AutoSaveLabel': 'Автосохранение',
	'ShowMainScreen': true,
	'Preload': false,
	'AutoSave': 0,
	'ServiceWorkers': false, // Отключаем кэширование на время разработки, чтобы изменения сразу применялись в браузере
	
	// Настройки для вертикального мобильного экрана 9:16
	'AspectRatio': '9:16',
	'ForceAspectRatio': 'None',
	'Orientation': 'portrait',
	
	// Включаем посимвольную анимацию печатания текста
	'TypeAnimation': true, 
	'InstantText': false,    // Текст пишется плавно, а не появляется мгновенно
	'NVLTypeAnimation': true,
	'NarratorTypeAnimation': true,
	'CenteredTypeAnimation': true,
	'Skip': 0,
	
	// Точные относительные пути до твоих медиа-папок внутри assets
	'AssetsPath': {
		'root': 'assets',
		'characters': 'characters',
		'icons': 'icons',
		'images': 'images',
		'music': 'music',
		'scenes': 'scenes',
		'sounds': 'sounds',
		'ui': 'ui',
		'videos': 'videos',
		'voices': 'voices',
		'gallery': 'gallery'
	},
	'SplashScreenLabel': '_SplashScreen',
	'Storage': {
		'Adapter': 'IndexedDB',
		'Store': 'GameData',
		'Endpoint': ''
	},
	'AllowRollback': true,
	'ExperimentalFeatures': false,
	'Screenshots': false
});

// Настройки громкости по умолчанию и скорости текста
monogatari.preferences({
	'Language': 'Русский',
	'Volume': {
		'Music': 0.8,
		'Voice': 1.0,
		'Sound': 0.8,
		'Video': 1.0
	},
	'Resolution': '1080x1920', // Вертикальное разрешение
	'TextSpeed': 35,           // Оптимальная скорость появления букв для комфортного чтения
	'AutoPlaySpeed': 5
});

// Кастомные настройки аудио-ядра Monogatari
monogatari.configuration({
	'AudioFade': 250 // Твои 0.25 секунды затухания звука из Unity
});
