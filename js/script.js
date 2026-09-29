// js/script.js

// Профессиональный отказоустойчивый мост для Яндекс.Метрики (с поддержкой очереди)
window.sendVaelGoal = function(goalId) {
    const counterId = 112954462; // Твой реальный ID счетчика (замени на свой, если он другой)
    
    console.log(`📊 [АНАЛИТИКА] Попытка отправки цели: "${goalId}"`);
    
    // 1. Создаем или подхватываем встроенный глобальный буфер Яндекс.Метрики
    window.ym = window.ym || function() {
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

monogatari.characters ({
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

window.camera = function(offsetX, offsetY, scalePercent) {
    return function() {
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


monogatari.script ({
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
		'h Мелкие, еле заметные капли дождя висели в воздухе. Они больше походили на пыль, на уютное облако, которое пахло мокрым сеном, теплом и мякотью земли.',

        'stop sound',
		'play sound scene_1_block_2',
		window.camera(30, -20, 112),
		'h Запах грибов, вялой травы и листьев наполнял все вокруг и казалось, что дома, скамейки, старое дерево и даже соседский дворник пропитаны этим ароматом.',

        'stop sound',
		'play sound scene_1_block_3',
		window.camera(35, 85, 100),
		'h Двенадцать часов, полдень, а на улице почти сумерки. Тяжелые серые с синевой тучи казалось зацепились за верхушки деревьев.',

        'stop sound',
		'play sound scene_1_block_4',
		window.camera(20, 90, 120), 
		'h Они заполнили все доступное пространство между небом и землей и теперь нельзя было с достоверной точностью сказать где именно начиналось и заканчивалось небо. ',

        'stop sound',
		'play sound scene_1_block_5',
		window.camera(35, 85, 105),
		'h Но тяжесть эта не давила, напротив, было приятно и уютно чувствовать себя окутанным такой необыкновенной атмосферой.',
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
		'h Дорога моя проходила через весь наш небольшой городок, да и сам городок был довольно скромных размеров.',

        'stop sound',
		'play sound scene_2_block_2',
		window.camera(25, -15, 108),
		'h А дорога шла так: по узкой улице с каштанами, затем сворачивала направо, огибая старый двухэтажный, разбухший от сырости кирпичный дом, бежала вниз узкой тропинкой, где даже старый асфальт был редкостью, и вливалась в великолепный парк.',

        'stop sound',
		'play sound scene_2_block_3',
		window.camera(-30, 10, 105),
		'h Дальше петляла вокруг величественных, уже затихших фонтанов, делалась то широкой, то мощеной булыжником, то превращалась в грязную тропинку с торчащими корнями.',

        'stop sound',
		'play sound scene_2_block_4',
		window.camera(45, -25, 115),
		'h В конце пути дорожка становилась большим бульваром. На этот бульвар я, собственно, и направлялся. В общем-то целью моей был вовсе не бульвар а прекрасное, атмосферное кафе с интерьером в стиле начала двадцатого века: синнабон лучше чем в этом кафе я не видел за всю свою жизнь!',

        'stop sound',
		'play sound scene_2_block_5',
		window.camera(0, -35, 110),
		'h Плотный, насыщенный запах корицы, свежей выпечки и кофе вел меня, тянул и манил словно пчелу на сироп в осеннюю, мрачную погоду через весь город.',

        'stop sound',
		'play sound scene_2_block_6',
		window.camera(-15, -15, 103),
		'h Выйдя на улицу я ощутил настоящее волшебство в своем носу: нюхательные краски в виде мокрых листьев и уличной сырости ударили в голову не хуже двух бокалов чего-то достойного из Бордо или Бургундии.',

        'stop sound',
		'play sound scene_2_block_7',
		window.camera(60, 0, 120),
		'h Полы моего пальто в тот же миг подались ветру, не в силах противостоять ему. Шляпа в общем-то тоже. Собрав все обратно, я вышел из узкого переулка и медленно зашагал по мокрому, широкому тротуару.',

        function () {
			window.sendVaelGoal('read_chapter_2');
			return true;
		},

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
		'h Машины медленно, не быстрее неспешной походки человека ползли одна за другой по узкой дороге, блестя фарами с ближним светом.',

        'stop sound',
		'play sound scene_3_block_2',
		window.camera(15, 20, 106),
		'h Капельки дождя, пролетая в лучах света фар, ярко вспыхивали, блестели. Как будто и не было этих капель до того момента как они попадали в луч, да и после того как вылетали из луча их тоже не существовало.',

        'stop sound',
		'play sound scene_3_block_3',
		window.camera(-40, -20, 112),
		'h Это наводило меня на некоторые более глобальные размышления, начали закрадываться аналогии с чем-то более важным нежели дождевые капли.',

        'stop sound',
		'play sound scene_3_block_4',
		window.camera(35, -10, 107),
		'h Я даже остановился в этих раздумьях. Но резкий порыв мокрого ветра пробудил меня к миру реальному.',

        'stop sound',
		'play sound scene_3_block_5',
		window.camera(0, 0, 100),
		'h Было стойкое ощущение что все кто находился за рулем плотно пообедали и никуда больше не спешили, и в полудреме просто двигались в точки своего назначения.',

        'stop sound',
		'play sound scene_3_block_6',
		window.camera(25, -15, 108),
		'h Все просто медленно, спокойно и размеренно ехали к своим целям. Вот большой, тучный мужчина, с маленькими усиками, в белом “каблуке”, двумя руками держит руль сверху и вглядывается в протертое тряпкой пятно на запотевшем лобовом стекле.',

        'stop sound',
		'play sound scene_3_block_7',
		window.camera(-30, 10, 105),
		'h Как будто он смотрит не куда-то а как раз через что то, через стекло, не имея никакой цели что-то увидеть. Видимо как раз такой вид взгляда и называют “взгляд в никуда”.',

        'stop sound',
		'play sound scene_3_block_8',
		window.camera(45, -25, 115),
		'h Он так увлекся своими мыслями что не увидел как уже несколько секунд горит зеленый светофор.',

        'stop sound',
		'play sound scene_3_block_9',
		window.camera(0, -35, 110),
		'h Такой оплошности водители, стоящие за ним, конечно же не могли ему простить: почти одновременно женщина из своего черного Рено и мужчина из такого же цвета то ли тоже Рено, то ли Фиата, то ли чего-то другого дали своему рассеянному попутчику понять с помощью клаксонов, что пора ехать.',
		
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
		'h Редкие прохожие, в основном под зонтами, все же имели более спешащий и несколько встревоженный вид: они спешили, иногда даже переходя на бег.',

        'stop sound',
		'play sound scene_4_block_2',
		window.camera(-15, -15, 103),
		'h Проходя под большими ветками старых каштанов они снижали темп, как бы веря, что теперь они под надежной защитой раскидистых крон, и дождевые капли им точно не страшны. А затем снова старались быстрее добежать до следующего дерева.',

        'stop sound',
		'play sound scene_4_block_3',
		window.camera(60, 0, 120),
		'h Я прошел до конца улицы и свернул направо, на узкую дорожку, которая больше походила на лесную тропинку чем на пешеходную дорогу.',

        'stop sound',
		'play sound scene_4_block_4',
		window.camera(15, 20, 106),
		'h Там сям стояли лужи, и мелкие капли будоражили грязную воду, подбрасывая ее вверх и разбрызгивая по сторонам.',

        'stop sound',
		'play sound scene_4_block_5',
		window.camera(-40, -20, 112),
		'h Я почувствовал что правый мой ботинок сдался и теперь там обосновалась вполне приличная влажность. Тут машин почти не было слышно и я четко стал отличать удары капель о мокрые листья и траву, тихое, убаюкивающее шуршание.',

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
		'h Удивительно, но подходя ближе к парку становилось отчетливо видно, что некоторые ветки уже стали полностью голыми, потеряв свои листья. Желтые, оранжевые, серые и коричневые краски заполнили это чудесное место, они смешивались будучи чужеродными друг другу.',

        'stop sound',
		'play sound scene_5_block_2',
		window.camera(35, -10, 107),
		'h Редкие птички, надувшись и став пористыми, сидели на ветках, некоторые еще пытались воспроизводить какие-то свои, совершенно не вписывающиеся в общую концепцию осени мелодии.',

        'stop sound',
		'play sound scene_5_block_3',
		window.camera(25, -15, 108),
		'h Но именно они наполняли парк тем самым неравномерным шумом, который, смешиваясь с шумом дождя и ветра, заполнял всю вселенную.',

        'stop sound',
		'play sound scene_5_block_4',
		window.camera(-30, 10, 105),
		'h Было интересно наблюдать как белка, совершенно не боясь редких прохожих, пыталась раздобыть себе очередной зимний припас, молниеносно бегала от дерева к дереву.',

        'stop sound',
		'play sound scene_5_block_5',
		window.camera(45, -25, 115),
		'h Иногда она резво взбегала почти до самой верхушки тополя, клена, потом резко спускалась вниз, казалось она сейчас разобьется, но нет, эта рыжая молния оказывалась во сто раз проворнее самой смелой мысли и быстрее самого трезвого разума, ибо она вот уже оказывалась в десяти метрах от того места где была секунду назад.',

        'stop sound',
		'play sound scene_5_block_6',
		window.camera(0, -35, 110),
		'h Сорока, я давно не видел сорок! А вот она. Мокрая, тяжелая, жирная осенняя птица, она быстро маша крыльями перелетала с одного дерева на другое. Для нее как будто выключили насыщенность: она была черно белой, но тем не менее она имела свои краски.',

        'stop sound',
		'play sound scene_5_block_7',
		window.camera(-15, -15, 103),
		'h Перья, даже мокрые, переливались на том скудном свету который благосклонно давало нам небо. Я невольно остановился, приглядевшись к птице.',

        'stop sound',
		'play sound scene_5_block_8',
		window.camera(60, 0, 120),
		'h Она, в общем, решила уподобиться проходящим мимо людям и тоже, такое чувство что никуда не спешила, просто размеренно перелетала с дерева на дерево и оглядывалась, резко поворачивая голову то влево то вправо.',

        function () {
			window.sendVaelGoal('read_chapter_5');
			return true;
		},

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
		'h Я вышел к небольшому пруду в самом конце парка. Он был мелок, и через его кристальную воду было видно дно.',

        'stop sound',
		'play sound scene_6_block_2',
		window.camera(15, 20, 106),
		'h Оно было полностью покрыто коричневыми листьями, что полностью повторяло весь ландшафт который меня сейчас окружал, и на удивление органично вписывалось в общую концепцию.',

        'stop sound',
		'play sound scene_6_block_3',
		window.camera(-40, -20, 112),
		'h Тут еще больше пахло землей и грибами, листья, заботливо сгребенные в кучки работниками парка, начали гнить, и разносили по парку какие-то свои флюиды, которые принуждали во все это влюбиться. Я почувствовал что капли дождя добрались и до моей спины…',

        'stop sound',
		'play sound scene_6_block_4',
		window.camera(35, -10, 107),
		'h Выйдя из парка я оказался как раз в начале того самого изумительного бульвара: неширокая полоса пешеходной дорожки с винтажными лавками справа и слева, была окружена с обеих сторон рядами старых, дряхлых кленов.',

        'stop sound',
		'play sound scene_6_block_5',
		window.camera(25, -15, 108),
		'h Ряды эти в свою очередь обрамлялись двумя узкими асфальтными дорогами. Я медленно пошел по бульвару, и вот, вот оно: запах выпечки, свежей, столь манящей.',

        'stop sound',
        'play sound scene_6_block_6',
		window.camera(-30, 10, 105),
		'h А сладкая глазурь! Даже не видя выпечки, я почувствовал текстуру, мякоть и вкус неповторимых синнабон, круассанов и кофе.',

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
		'h Нельзя терять ни минуты, недопустимо! Только открыв дверь в кафе, услышав треск камина, я очутился в совершенно другом, таком чуждом осеннему ветру и дождю мире.',

        'stop sound',
		'play sound scene_7_block_2',
		window.camera(-45, 65, 115),
		'h Уютное тепло, даже жар, налетел на меня лавиной, смутив в краску мое холодное лицо, пристыдил меня, но тут же окутал собой, снял с меня пальто, шляпу, взял мой мокрый зонт, поднял меня над полом, почти до потолка, понес по широкому просторному залу кафе, и усадил за круглый столик, как раз возле небольшого окна с подоконником, откуда открывался прекрасный вид на бульвар. ',

        'stop sound',
		'play sound scene_7_block_3',
		window.camera(0, 55, 110),
		'h Мокрый, дождливый с запахом грибов.',

        'stop sound',
		'play sound scene_7_block_4',
		window.camera(-75, 75, 103),
		'h Принесли кофе.',

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
        function() {
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


monogatari.assets ('music', {
	'ambient_scene1': 'Scene_1.ogg',
	'ambient_scene2': 'Scene_2.ogg',
	'ambient_scene3': 'Scene_3.ogg',
    'ambient_scene4': 'Scene_4.ogg',
    'ambient_scene5': 'Scene_5.ogg',
    'ambient_scene6': 'Scene_6.ogg',
    'ambient_scene7': 'Scene_7.ogg'
});

monogatari.assets ('sounds', {
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
monogatari.assets ('images', {
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

