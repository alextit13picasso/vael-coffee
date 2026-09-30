'use strict';
/* global Monogatari, monogatari */

/**
 * =============================================================================
 * This is the file where you should put all your custom JavaScript code,
 * depending on what you want to do, there are 3 different places in this file
 * where you can add code.
 *
 * 1. Outside the $_ready function: At this point, the page may not be fully
 *    loaded yet, however you can interact with Monogatari to register new
 *    actions, components, labels, characters, etc.
 *
 * 2. Inside the $_ready function: At this point, the page has been loaded, and
 *    you can now interact with the HTML elements on it.
 *
 * 3. Inside the init function: At this point, Monogatari has been initialized,
 *    the event listeners for its inner workings have been registered, assets
 *    have been preloaded (if enabled) and your game is ready to be played.
 *
 * You should always keep the $_ready function as the last thing on this file.
 * =============================================================================
 **/

const { $_ready, $_ } = Monogatari;

// 1. Outside the $_ready function:

monogatari.debug.level(5);

$_ready(() => {
	// 2. Inside the $_ready function:

	monogatari.init('#monogatari').then(() => {

		const startBtn = document.querySelector('[data-action="start"]');
		if (startBtn) {
			startBtn.addEventListener('click', () => {
				if (typeof window.sendVaelGoal === 'function') {
					window.sendVaelGoal('click_read');
				}
			});
		}

		// === ЖЕЛЕЗНЫЙ ИНЖЕКТОР ФИНАЛЬНОЙ КНОПКИ В КОРЕНЬ ===
		const finalBoostyBtn = document.getElementById('custom-final-boosty-btn');
		if (finalBoostyBtn) {
			// Навешиваем только ОДИН слушатель клика
			finalBoostyBtn.addEventListener('click', (event) => {
				event.stopPropagation(); // Останавливаем всплытие события в движке

				console.log("🖱️ [ФИНАЛ] Нажата центральная кнопка. Переход на Boosty...");

				// 1. Отправляем финальную метрику вступления в клуб (СТРОГО ОДИН РАЗ)
				if (typeof window.sendVaelGoal === 'function') {
					window.sendVaelGoal('click_join_private_club');
				}

				// 2. Открываем твою прямую ссылку на Boosty
				window.open('https://boosty.to/vael', '_blank');
			});
		}

		// === ОБРАБОТКА КЛИКА ПО ПОЛНОШИРИННОЙ КНОПКЕ "ДАЛЕЕ" ===
		const textNextBtn = document.getElementById('custom-text-next-btn');
		if (textNextBtn) {
			textNextBtn.addEventListener('click', (event) => {
				event.stopPropagation();
				console.log("⚡ [КЛИК] Полноширинный тап. Перелистываем блок...");
				monogatari.proceed();
			});
		}

		const readMoreBtn = document.getElementById('custom-read-more-btn');
		if (readMoreBtn) {
			readMoreBtn.addEventListener('click', () => {
				console.log("🖱️ [КЛИК] Переход в клуб по кнопке 'Читать еще'");

				// 1. Отправляем событие клика для Яндекс.Метрики наружу в Tilda
				if (window.parent && window.parent.postMessage) {
					window.sendVaelGoal('click_private_club');
				}

				// 2. Открываем прямую ссылку на твой Boosty в новой вкладке
				window.open('https://boosty.to/vael', '_blank');
			});
		}


		console.log("🚀 [ПАНДОРА-АВТОМАТ] Активация сквозного слежения за плеерами...");

		let advanceTimer = null;

		// 1. Перехватываем метод получения медиаплеера в Monogatari
		const originalMediaPlayer = monogatari.mediaPlayer;

		monogatari.mediaPlayer = function (type, asset, ...args) {
			// Вызываем оригинальный метод, чтобы движок выдал нам инстанс плеера
			const player = originalMediaPlayer.call(monogatari, type, asset, ...args);

			// Если движок запрашивает плеер для канала "sound"
			if (type === 'sound' && player) {
				console.log(`🎯 [ПАНДОРА] Поймали инициализацию звука для ассета: "${asset}"`);

				// На всякий случай сбрасываем старый таймер автоперехода
				if (advanceTimer) clearTimeout(advanceTimer);

				// Ждем микросекунду, чтобы плеер успел стартануть в памяти
				setTimeout(() => {
					// Достаем длительность аудиофайла из внутренних свойств Howler (он спрятан внутри плеера)
					const duration = player._duration || (typeof player.duration === 'function' ? player.duration() : player.duration);
					console.log(`⏱️ [ПАНДОРА ТАЙМИНГ] Файл "${asset}" длится: ${duration} сек.`);
					// === НАЧАЛО БЛОКА РАСЧЕТА ПРОГРЕССА (ПЕРЕПИСАННЫЙ) ===
					try {
						const totalBlocks = 44;
						const currentLabel = monogatari.state('label') || 'scene_1';
						
						// Вытаскиваем номер блока прямо из имени файла (например, из "scene_1_block_2" достанет 2)
						const match = asset.match(/_block_(\d+)/);
						const stepInLabel = match ? parseInt(match[1], 10) - 1 : 0;
						
						let previousBlocksOffset = 0;
						if (currentLabel === 'scene_2') previousBlocksOffset = 5;  
						if (currentLabel === 'scene_3') previousBlocksOffset = 12; 
						if (currentLabel === 'scene_4') previousBlocksOffset = 21; 
						if (currentLabel === 'scene_5') previousBlocksOffset = 26; 
						if (currentLabel === 'scene_6') previousBlocksOffset = 34; 
						if (currentLabel === 'scene_7') previousBlocksOffset = 40; 

						const absoluteCurrentStep = previousBlocksOffset + stepInLabel;
						const progressPercent = Math.min(((absoluteCurrentStep + 1) / totalBlocks) * 100, 100);

						console.log(`📊 [PROGRESS] Сцена: ${currentLabel} | Шаг: ${stepInLabel} | Абсолютный шаг: ${absoluteCurrentStep + 1}/${totalBlocks} | Прогресс: ${progressPercent.toFixed(1)}%`);
						
						// СРАЗУ ДВИГАЕМ ВИЗУАЛЬНУЮ ПОЛОСКУ В CSS, ЕСЛИ ОНА ЕСТЬ В HTML
						const progressBar = document.getElementById('custom-progress-bar');
						if (progressBar) {
							progressBar.style.width = progressPercent + '%';
						}
					} catch (progressError) {
						console.log("❌ Ошибка расчета шага: " + progressError.message);
					}
					// === КОНЕЦ БЛОКА РАСЧЕТА ПРОГРЕССА ===


					if (duration && duration > 0) {
						const totalWaitTime = (duration + 0.3) * 1000; // Длина mp3 + 300мс пауза
						console.log(`🎯 [ПАНДОРА ТАЙМЕР] Заводим автоматический клик через ${totalWaitTime} мс.`);

						advanceTimer = setTimeout(() => {
							console.log("⚡ [ПАНДОРА КЛИК] Время вышло! Продвигаем сцену вперед...");
							monogatari.proceed();
						}, totalWaitTime);
					}
				}, 10);
			}

			return player;
		};

	});
});
