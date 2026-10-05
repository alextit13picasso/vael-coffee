// js/script.js

// Профессиональный отказоустойчивый мост для Яндекс.Метрики (с поддержкой очереди)
window.sendVaelGoal = function (goalId) {
	const counterId = 112954462; // Твой реальный ID счетчика (замени на свой, если он другой)

	console.log(`📊 [АНАЛИТИКА] Попытка отправки цели: "${goalId}"`);

	// 1. Создаем или подхватываем встроенный глобальный буфер Яндекс.Метрики
	window.ym = window.ym || function () {
		(window.ym.a = window.ym.a || []).push(arguments);
	};

	// 2. Добавляем в очередь метку времени, если скрипт еще грузится
	window.ym.l = window.ym.l || 1 * new Date();

	// 3. Железно пушим цель в буфер. Если ym() уже на связи — она улетит сразу. 
	// Если еще загружается — улетит автоматически через микросекунду после старта тега.
	try {
		window.ym(counterId, 'reachGoal', goalId);
		console.log(`✅ [АНАЛИТИКА ОЧЕРЕДЬ] Цель "${goalId}" успешно добавлена в буфер отправки.`);
	} catch (e) {
		console.error(`❌ [АНАЛИТИКА КРИТ] Сбой буфера очереди при отправке "${goalId}":`, e);
	}
};

monogatari.characters({
	'h': {
		name: '',
		color: '#ffffff'
	}
});

// Глобальное состояние камеры с раздельными текущими и целевыми координатами
window.cameraState = {
	currentX: 0,
	currentY: 0,
	currentScale: 100,

	targetX: 0,
	targetY: 0,
	targetScale: 100,

	// Скорость плавного догона базы при смене блоков
	lerpSpeed: 0.04
};

window.camera = function (offsetX, offsetY, scalePercent) {
	return function () {
		window.cameraState.targetX = offsetX;
		window.cameraState.targetY = offsetY;
		window.cameraState.targetScale = scalePercent;
		return true;
	};
};

// Цикл ультра-выразительного покачивания (ИГРА + ГЛАВНОЕ МЕНЮ)
(function startGlobalCinemaCamera() {
	let time = 0;

	function updateCamera() {
		const state = window.cameraState;

		// 1. Мягкий догон целевой точки параллакса (для игрового процесса)
		state.currentX += (state.targetX - state.currentX) * state.lerpSpeed;
		state.currentY += (state.targetY - state.currentY) * state.lerpSpeed;
		state.currentScale += (state.targetScale - state.currentScale) * state.lerpSpeed;

		// 2. Размашистая амплитуда покачивания (60px на 40px)
		time += 0.012;
		const swayX = Math.sin(time * 1.1) * 60;
		const swayY = Math.cos(time * 0.75) * 40;

		const finalX = state.currentX + swayX;
		const finalY = state.currentY + swayY;

		// ==========================================
		// ЧАСТЬ 1: ОЖИВЛЕНИЕ СТАРТОВОГО ЭКРАНА (МЕНЮ)
		// ==========================================
		const mainMenuScreen = document.querySelector('[data-screen="main"]');
		if (mainMenuScreen) {
			/* 
			   Поскольку фон главного меню задан через CSS background-image,
			   мы плавно качаем его позицию на 20% (как и бэкграунд в игре)
			*/
			const menuBackX = finalX * 0.2;
			const menuBackY = finalY * 0.2;

			// Смещаем фоновую позицию относительно стандартного центра (50% 50%)
			mainMenuScreen.style.setProperty(
				'background-position',
				`calc(50% + ${menuBackX}px) calc(50% + ${menuBackY}px)`,
				'important'
			);
		}

		// ==========================================
		// ЧАСТЬ 2: ОЖИВЛЕНИЕ ИГРОВОГО ПРОЦЕССА
		// ==========================================
		// Рендер переднего плана (Персонаж в шляпе)
		const frontImg = document.querySelector('[data-screen="game"] [data-image*="_front"]');
		if (frontImg) {
			const targetX = `calc(50% - 60px + ${finalX}px)`;
			const targetY = `calc(50% + 340px + ${finalY}px)`;

			frontImg.style.setProperty('object-position', `${targetX} ${targetY}`, 'important');
			frontImg.style.setProperty('transform', `scale(${state.currentScale / 100})`, 'important');
		}

		// Рендер заднего плана (Фон сцены)
		const backImg = document.querySelector('[data-screen="game"] [data-image*="_back"]');
		if (backImg) {
			const backX = finalX * 0.2;
			const backY = finalY * 0.2;

			backImg.style.setProperty('transform', `scale(1.25) translate(${backX}px, ${backY}px)`, 'important');
		}

		requestAnimationFrame(updateCamera);
	}

	document.addEventListener("DOMContentLoaded", () => {
		requestAnimationFrame(updateCamera);
	});
})();

monogatari.script({
	// Точка входа в игру
	'Start': [
		function () {
			// Если игрок начинает заново — гарантированно включаем дождь обратно
			const canvas = document.getElementById('rainCanvas');
			if (canvas) canvas.style.display = 'block';
			return true;
		},
		'play music ambient_scene1 loop',
		'show image scene_1_back with fadeIn',
		'show image scene_1_front with fadeIn',
		'wait 3000',
		'jump scene_1'
	],

	// --- СЦЕНА 1 ---
	'scene_1': [
		'play sound scene_1_block_1',
		window.camera(0, 0, 100),
		'h A fine, almost invisible drizzle hung in the air, resembling dust more than rain—a comforting cloud that smelled of damp hay, warmth, and the rich earth.',

		'stop sound',
		'play sound scene_1_block_2',
		window.camera(30, -20, 112),
		'h The scent of mushrooms, wilted grass, and fallen leaves filled the air, as if the houses, the benches, the old tree, and even the neighbor\'s yard-keeper were steeped in this fragrance.',

		'stop sound',
		'play sound scene_1_block_3',
		window.camera(35, 85, 100),
		'h Twelve o’clock, noon, yet it was nearly twilight outside. Heavy, slate-blue clouds seemed to have caught on the treetops.',

		'stop sound',
		'play sound scene_1_block_4',
		window.camera(20, 90, 120),
		'h They filled every inch of space between heaven and earth, until it was impossible to tell with any certainty where the sky began and where it ended. ',

		'stop sound',
		'play sound scene_1_block_5',
		window.camera(35, 85, 105),
		'h Yet this weight did not oppress; on the contrary, it felt pleasant and cozy to be wrapped in such an extraordinary atmosphere.',
		function () {
			window.sendVaelGoal('read_chapter_1');
			return true;
		},

		'jump scene_2'
	],

	// --- СЦЕНА 2 ---
	'scene_2': [
		'hide image scene_1_back with fadeOut',
		'hide image scene_1_front with fadeOut',
		'show image scene_2_back with fadeIn',
		'show image scene_2_front with fadeIn',

		'stop music',
		'play music ambient_scene2 loop',
		'stop sound',
		'play sound scene_2_block_1',

		window.camera(0, 0, 100),
		'h My route stretched across our entire town, which was itself rather modest in size. The way went like this: down a narrow street lined with chestnut trees, then a right turn around an old, two-story brick house swollen with dampness; from there, it ran down a narrow path where even weathered asphalt was a rarity, and spilled into a magnificent park.',

		'stop sound',
		'play sound scene_2_block_2',
		window.camera(25, -15, 108),
		'h Next, it meandered around majestic, now-silent fountains, turning now broad, now paved with cobblestones, then morphing into a muddy trail of protruding roots. At its end, the path opened into a grand boulevard. This boulevard was, in fact, my destination.',

		'stop sound',
		'play sound scene_2_block_3',
		window.camera(-30, 10, 105),
		'h Well, truth be told, my goal wasn\'t the boulevard itself, but a beautiful, atmospheric café with an early-twentieth-century interior—never in my life have I seen a cinnabon better than the ones they made there!',

		'stop sound',
		'play sound scene_2_block_4',
		window.camera(45, -25, 115),
		'h The thick, rich scent of cinnamon, fresh pastries, and coffee guided me, drawing and luring me through the entire town like a bee to syrup in this bleak autumn weather.',

		'stop sound',
		'play sound scene_2_block_5',
		window.camera(0, -35, 110),
		'h Stepping outside, I felt a true magic hit my senses: the olfactory colors of wet leaves and street dampness rushed to my head, every bit as heady as two glasses of something decent from Bordeaux or Burgundy.',

		'stop sound',
		'play sound scene_2_block_6',
		window.camera(-15, -15, 103),
		'h  In that exact moment, the tails of my coat gave in to the wind, powerless to resist it.',

		'stop sound',
		'play sound scene_2_block_7',
		window.camera(60, 0, 120),
		'h My hat, frankly, did much the same. Gathering myself back together, I emerged from the narrow alley and began to stroll slowly along the wet, wide sidewalk.',

		 ((process) => {
            // 1. Сначала тихо отправляем цель в метрику
            if (window.sendVaelGoal) {
                window.sendVaelGoal('read_chapter_2');
            }
        }),

		'jump scene_3'
	],

	// --- СЦЕНА 3 ---
	'scene_3': [
		'hide image scene_2_back with fadeOut',
		'hide image scene_2_front with fadeOut',
		'show image scene_3_back with fadeIn',
		'show image scene_3_front with fadeIn',

		'stop music',
		'play music ambient_scene3 loop',
		'stop sound',
		'play sound scene_3_block_1',
		window.camera(25, 10, 100),
		'h The cars crawled one after another along the narrow road, no faster than a person’s leisurely stroll, their low beams glistening. Raindrops flashed and sparkled as they drifted through the headlamp beams.',

		'stop sound',
		'play sound scene_3_block_2',
		window.camera(15, 20, 106),
		'h It was as if these drops didn\'t even exist before entering the light, and ceased to be the moment they left it. This nudged me toward grander contemplations; analogies began to creep in, pointing to something far more significant than mere raindrops.',

		'stop sound',
		'play sound scene_3_block_3',
		window.camera(-40, -20, 112),
		'h I even paused, lost in these thoughts. But a sharp gust of wet wind shook me back to reality.',

		'stop sound',
		'play sound scene_3_block_4',
		window.camera(35, -10, 107),
		'h There was a lingering sense that everyone behind the wheel had just had a heavy lunch and was in absolutely no rush, drifting toward their destinations in a half-slumber.',

		'stop sound',
		'play sound scene_3_block_5',
		window.camera(0, 0, 100),
		'h Everyone was simply moving toward their goals—slowly, calmly, and deliberately.',

		'stop sound',
		'play sound scene_3_block_6',
		window.camera(25, -15, 108),
		'h Take that large, stout man with a tiny mustache in a white panel van; both his hands gripped the top of the steering wheel as he peered through a patch on the fogged-up windshield that had been wiped clean with a rag.',

		'stop sound',
		'play sound scene_3_block_7',
		window.camera(-30, 10, 105),
		'h It was as if he weren\'t looking at something, but rather through it, with no real intention of seeing anything at all.',

		'stop sound',
		'play sound scene_3_block_8',
		window.camera(45, -25, 115),
		'h This must be precisely what they call a "stare into nowhere." He was so lost in thought that he failed to notice the traffic light had been green for several seconds.',

		'stop sound',
		'play sound scene_3_block_9',
		window.camera(0, -35, 110),
		'h The drivers behind him, of course, could never forgive such an oversight: almost simultaneously, a woman in a black Renault and a man in an identical-looking black car—be it another Renault, a Fiat, or something else entirely—used their horns to let their absent-minded companion know it was time to move.',

		function () {
			window.sendVaelGoal('read_chapter_3');
			return true;
		},

		'jump scene_4'
	],

	// --- СЦЕНА 4 ---
	'scene_4': [
		'hide image scene_3_back with fadeOut',
		'hide image scene_3_front with fadeOut',
		'show image scene_4_back with fadeIn',
		'show image scene_4_front with fadeIn',

		'stop music',
		'play music ambient_scene4 loop',
		'stop sound',
		'play sound scene_4_block_1',
		window.camera(0, 0, 100),
		'h The rare pedestrians, mostly huddled under umbrellas, looked much more hurried and somewhat anxious; they rushed along, occasionally even breaking into a run.',

		'stop sound',
		'play sound scene_4_block_2',
		window.camera(-15, -15, 103),
		'h Passing under the heavy branches of the old chestnut trees, they would slow their pace, as if believing they were now under the reliable protection of the spreading canopies, completely safe from the raindrops.',

		'stop sound',
		'play sound scene_4_block_3',
		window.camera(60, 0, 120),
		'h But then, they would quicken their steps again, eager to reach the next tree.',

		'stop sound',
		'play sound scene_4_block_4',
		window.camera(15, 20, 106),
		'h I walked to the end of the street and turned right onto a narrow path that resembled a woodland trail more than a pedestrian walkway. Puddles lay scattered here and there, and the fine drizzle agitated the muddy water, tossing it upward and splashing it outward.',

		'stop sound',
		'play sound scene_4_block_5',
		window.camera(-40, -20, 112),
		'h  I felt my right shoe finally give in, and a quite respectable dampness settled inside. Here, the hum of cars was barely audible, and I could clearly discern the strike of droplets against the wet leaves and grass—a quiet, lulling rustle.',

		function () {
			window.sendVaelGoal('read_chapter_4');
			return true;
		},

		'jump scene_5'
	],

	// --- СЦЕНА 5 ---
	'scene_5': [
		'hide image scene_4_back with fadeOut',
		'hide image scene_4_front with fadeOut',
		'show image scene_5_back with fadeIn',
		'show image scene_5_front with fadeIn',

		'stop music',
		'play music ambient_scene5 loop',
		'stop sound',
		'play sound scene_5_block_1',
		window.camera(0, 0, 100),
		'h Surprisingly, as I drew closer to the park, it became distinctly clear that some branches were already completely bare, having shed their leaves. Yellow, orange, gray, and brown hues filled this wonderful place, blending together despite being foreign to one another.',

		'stop sound',
		'play sound scene_5_block_2',
		window.camera(35, -10, 107),
		'h A few rare birds, puffed up and looking porous, sat on the branches; some were still trying to pipe their own tunes, which seemed utterly out of keeping with the overall theme of autumn.',

		'stop sound',
		'play sound scene_5_block_3',
		window.camera(25, -15, 108),
		'h Yet it was these very sounds that filled the park with that uneven hum which, merging with the whisper of rain and wind, expanded to fill the entire universe.',

		'stop sound',
		'play sound scene_5_block_4',
		window.camera(-30, 10, 105),
		'h It was fascinating to watch a squirrel, entirely unfazed by the occasional passersby, trying to forage another winter stash as it darted lightning-fast from tree to tree.',

		'stop sound',
		'play sound scene_5_block_5',
		window.camera(45, -25, 115),
		'h Now and then, it would briskly scamper almost to the very top of a poplar or a maple, then drop down sharply—it seemed as though it would surely crash, but no, this red flash proved a hundred times more agile than the boldest thought and faster than the soberest mind, for there it already was, ten meters from where it had been just a second ago.',

		'stop sound',
		'play sound scene_5_block_6',
		window.camera(0, -35, 110),
		'h A magpie—I hadn\'t seen a magpie in ages! And here it was. A wet, heavy, plump autumn bird, it flew from one tree to another with quick, beating wings. It was as if someone had turned down the saturation for it: it was black and white, yet it possessed its own colors.',

		'stop sound',
		'play sound scene_5_block_7',
		window.camera(-15, -15, 103),
		'h Its feathers, even drenched, shimmered in the meager light that the sky so graciously bestowed upon us. I couldn\'t help but stop, fixing my gaze on the bird.',

		'stop sound',
		'play sound scene_5_block_8',
		window.camera(60, 0, 120),
		'h  It seemed to have decided to mimic the people passing by—as if it, too, was in no hurry at all, simply shifting from tree to tree in a measured way and looking about, sharply turning its head now left, now right',
		
		// Объединяем отправку цели и вызов межстраничного баннера Яндекса
        ((process) => {
            // 1. Сначала тихо отправляем цель в метрику
            if (window.sendVaelGoal) {
                window.sendVaelGoal('read_chapter_5');
            }
        }),

		'jump scene_6'
	],
	// --- СЦЕНА 6 ---
	'scene_6': [
		'hide image scene_5_back with fadeOut',
		'hide image scene_5_front with fadeOut',
		'show image scene_6_back with fadeIn',
		'show image scene_6_front with fadeIn',

		'stop music',
		'play music ambient_scene6 loop',
		'stop sound',
		'play sound scene_6_block_1',
		window.camera(0, 0, 100),
		'h I came upon a small pond at the very edge of the park. It was shallow, and through its crystalline water, the bottom was clearly visible.',

		'stop sound',
		'play sound scene_6_block_2',
		window.camera(15, 20, 106),
		'h It was entirely carpeted with brown leaves, mirroring the surrounding landscape perfectly and fitting into the overall scene with surprising harmony.',

		'stop sound',
		'play sound scene_6_block_3',
		window.camera(-40, -20, 112),
		'h Here, the scent of earth and mushrooms grew even stronger; the leaves, mindfully raked into piles by the park keepers, had begun to decompose, releasing their own peculiar vapors into the air—vations that compelled you to fall in love with it all. I felt the raindrops finally reach my back…',

		'stop sound',
		'play sound scene_6_block_4',
		window.camera(35, -10, 107),
		'h Leaving the park, I found myself right at the beginning of that very same exquisite boulevard. A fairly narrow pedestrian path, lined with vintage benches on either side, was flanked by rows of old, decrepit maples.',

		'stop sound',
		'play sound scene_6_block_5',
		window.camera(25, -15, 108),
		'h These rows, in turn, were framed by two narrow asphalt roads. I walked slowly down the boulevard, and then, there it was: the smell of fresh, utterly enticing pastries.',

		'stop sound',
		'play sound scene_6_block_6',
		window.camera(-30, 10, 105),
		'h And that sweet glaze! Even without seeing the baked goods, I could already feel the texture, the softness, and the taste of those incomparable cinnabons, croissants, and coffee.',

		function () {
			window.sendVaelGoal('read_chapter_6');
			return true;
		},

		'jump scene_7'
	],
	// --- СЦЕНА 7 ---
	'scene_7': [
		'hide image scene_6_back with fadeOut',
		'hide image scene_6_front with fadeOut',
		'show image scene_7_back with fadeIn',
		'show image scene_7_front with fadeIn',

		function () {
			/* ЖЕЛЕЗОБЕТОННЫЙ ВЫКЛЮЧАТЕЛЬ: 
			   Находим холст дождя по ID и полностью скрываем его из видимости */
			const canvas = document.getElementById('rainCanvas');
			if (canvas) {
				canvas.style.display = 'none';
			}
			return true; // Важно вернуть true, чтобы Monogatari пошел дальше по сценарию
		},

		'stop music',
		'play music ambient_scene7 loop',
		'stop sound',
		'play sound scene_7_block_1',
		window.camera(0, 0, 100),
		'h Not a single moment could be lost—it was simply unacceptable! The instant I pushed open the café door and caught the crackle of the fireplace, I found myself in a completely different world, one utterly foreign to the autumn wind and rain.',

		'stop sound',
		'play sound scene_7_block_2',
		window.camera(-45, 65, 115),
		'h A cozy warmth, hot even, rushed over me like an avalanche, flushing my cold face with color; it shamed me, yet instantly enveloped me.',

		'stop sound',
		'play sound scene_7_block_3',
		window.camera(0, 55, 110),
		'h It slipped off my coat and hat, took my wet umbrella, and lifted me right off the floor, nearly to the ceiling, carrying me across the wide, spacious hall of the café to seat me at a round table—right by a small window with a sill that offered a beautiful view of the boulevard. Wet, rainy, and smelling of mushrooms.',

		'stop sound',
		'play sound scene_7_block_4',
		window.camera(-75, 75, 103),
		'h Coffee was brought!',

		function () {
			window.sendVaelGoal('read_chapter_7');
			return true;
		},

		'show scene #000000 with fadeIn',
		'jump scene_final'
	],
	// Финальная сцена
	'scene_final': [
		// 1. ЖЕСТКИЙ ФИКС: Сначала полностью очищаем экран от старых картинок и фонов
		'clear',

		// 2. Останавливаем музыку предыдущей сцены
		'stop music',
		'stop sound',

		// 3. Запускаем финальный эмбиент Scene_7.ogg по кругу
		'play music ambient_scene7 loop',

		// 4. Мягко выводим финальный арт на весь экран
		'show image final_cover with fadeIn',

		function () {
			/* ЖЕЛЕЗОБЕТОННЫЙ ВЫКЛЮЧАТЕЛЬ ДОЖДЯ: 
			   Находим холст дождя по ID и полностью скрываем его из видимости */
			const canvas = document.getElementById('rainCanvas');
			if (canvas) {
				canvas.style.display = 'none';
			}
			return true;
		},

		// 5. ТОЛЬКО ТЕПЕРЬ активируем финальные стили и включаем саму кнопку
		function () {
			// Скрываем текстовое поле и кнопку "Далее" через класс body
			document.body.classList.add('in-final-scene');

			// Включаем отображение кнопки Boosty СТРОГО ПОСЛЕ команды 'clear'
			const finalBtn = document.getElementById('custom-final-boosty-btn');
			if (finalBtn) {
				finalBtn.style.setProperty('display', 'block', 'important');
				console.log("🎯 [УСПЕХ] Финальная кнопка принудительно отображена в DOM.");
			} else {
				console.error("❌ [КРИТ] Элемент #custom-final-boosty-btn не найден на странице!");
			}
			return true;
		},

		// Переносим паузу в самый конец, чтобы она не блокировала выполнение функции выше
		'wait 2000'
	]
});


monogatari.assets('music', {
	'ambient_scene1': 'Scene_1.ogg',
	'ambient_scene2': 'Scene_2.ogg',
	'ambient_scene3': 'Scene_3.ogg',
	'ambient_scene4': 'Scene_4.ogg',
	'ambient_scene5': 'Scene_5.ogg',
	'ambient_scene6': 'Scene_6.ogg',
	'ambient_scene7': 'Scene_7.ogg'
});

monogatari.assets('sounds', {
	'scene_1_block_1': 'scene_1_block_1.ogg',
	'scene_1_block_2': 'scene_1_block_2.ogg',
	'scene_1_block_3': 'scene_1_block_3.ogg',
	'scene_1_block_4': 'scene_1_block_4.ogg',
	'scene_1_block_5': 'scene_1_block_5.ogg',

	'scene_2_block_1': 'scene_2_block_1.ogg',
	'scene_2_block_2': 'scene_2_block_2.ogg',
	'scene_2_block_3': 'scene_2_block_3.ogg',
	'scene_2_block_4': 'scene_2_block_4.ogg',
	'scene_2_block_5': 'scene_2_block_5.ogg',
	'scene_2_block_6': 'scene_2_block_6.ogg',
	'scene_2_block_7': 'scene_2_block_7.ogg',

	'scene_3_block_1': 'scene_3_block_1.ogg',
	'scene_3_block_2': 'scene_3_block_2.ogg',
	'scene_3_block_3': 'scene_3_block_3.ogg',
	'scene_3_block_4': 'scene_3_block_4.ogg',
	'scene_3_block_5': 'scene_3_block_5.ogg',
	'scene_3_block_6': 'scene_3_block_6.ogg',
	'scene_3_block_7': 'scene_3_block_7.ogg',
	'scene_3_block_8': 'scene_3_block_8.ogg',
	'scene_3_block_9': 'scene_3_block_9.ogg',

	'scene_4_block_1': 'scene_4_block_1.ogg',
	'scene_4_block_2': 'scene_4_block_2.ogg',
	'scene_4_block_3': 'scene_4_block_3.ogg',
	'scene_4_block_4': 'scene_4_block_4.ogg',
	'scene_4_block_5': 'scene_4_block_5.ogg',

	'scene_5_block_1': 'scene_5_block_1.ogg',
	'scene_5_block_2': 'scene_5_block_2.ogg',
	'scene_5_block_3': 'scene_5_block_3.ogg',
	'scene_5_block_4': 'scene_5_block_4.ogg',
	'scene_5_block_5': 'scene_5_block_5.ogg',
	'scene_5_block_6': 'scene_5_block_6.ogg',
	'scene_5_block_7': 'scene_5_block_7.ogg',
	'scene_5_block_8': 'scene_5_block_8.ogg',

	'scene_6_block_1': 'scene_6_block_1.ogg',
	'scene_6_block_2': 'scene_6_block_2.ogg',
	'scene_6_block_3': 'scene_6_block_3.ogg',
	'scene_6_block_4': 'scene_6_block_4.ogg',
	'scene_6_block_5': 'scene_6_block_5.ogg',
	'scene_6_block_6': 'scene_6_block_6.ogg',

	'scene_7_block_1': 'scene_7_block_1.ogg',
	'scene_7_block_2': 'scene_7_block_2.ogg',
	'scene_7_block_3': 'scene_7_block_3.ogg',
	'scene_7_block_4': 'scene_7_block_4.ogg'
});

// Регистрируем слои картинок (ищутся в assets/images/)
monogatari.assets('images', {
	// Сцена 1
	'scene_1_front': 'scene_1_front.webp',
	'scene_1_back': 'scene_1_back.webp',

	// Сцена 2
	'scene_2_front': 'scene_2_front.webp',
	'scene_2_back': 'scene_2_back.webp',

	// Сцена 3
	'scene_3_front': 'scene_3_front.webp',
	'scene_3_back': 'scene_3_back.webp',

	// Сцена 4
	'scene_4_front': 'scene_4_front.webp',
	'scene_4_back': 'scene_4_back.webp',

	// Сцена 5
	'scene_5_front': 'scene_5_front.webp',
	'scene_5_back': 'scene_5_back.webp',

	// Сцена 6
	'scene_6_front': 'scene_6_front.webp',
	'scene_6_back': 'scene_6_back.webp',

	// Сцена 7
	'scene_7_front': 'scene_7_front.webp',
	'scene_7_back': 'scene_7_back.webp',

	// Сцена Финал
	'final_cover': 'final_scene_cover.webp',
	'final_button_asset': 'final_button.webp',
});

