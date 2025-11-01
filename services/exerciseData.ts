import type { ExerciseInfo } from '../types';

export const exerciseData: ExerciseInfo[] = [
    {
        id: 1,
        name: { en: 'Push-up', ar: 'تمرين الضغط' },
        description: {
            en: 'A classic bodyweight exercise that builds upper body strength, targeting the chest, shoulders, and triceps.',
            ar: 'تمرين كلاسيكي بوزن الجسم يبني قوة الجزء العلوي من الجسم، ويستهدف الصدر والكتفين والترايسبس.'
        },
        instructions: [
            { en: 'Start in a plank position with hands slightly wider than your shoulders.', ar: 'ابدأ في وضعية البلانك مع وضع اليدين أعرض قليلاً من كتفيك.' },
            { en: 'Lower your body until your chest nearly touches the floor.', ar: 'اخفض جسمك حتى يكاد صدرك يلمس الأرض.' },
            { en: 'Push yourself back up to the starting position.', ar: 'ادفع نفسك مرة أخرى إلى وضع البداية.' },
            { en: 'Keep your core engaged and your body in a straight line.', ar: 'حافظ على جذعك مشدودًا وجسمك في خط مستقيم.' },
        ],
        muscleGroup: { en: 'Chest, Shoulders, Triceps', ar: 'الصدر، الكتفين، الترايسبس' },
        difficulty: 'beginner',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Push-up.gif',
        videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4'
    },
    {
        id: 2,
        name: { en: 'Squat', ar: 'تمرين القرفصاء (سكوات)' },
        description: {
            en: 'A fundamental lower body exercise that strengthens the legs, glutes, and core.',
            ar: 'تمرين أساسي للجزء السفلي من الجسم يقوي الساقين والأرداف والجذع.'
        },
        instructions: [
            { en: 'Stand with your feet shoulder-width apart, chest up.', ar: 'قف مع تباعد قدميك بعرض الكتفين، وصدرك مرفوع.' },
            { en: 'Lower your hips back and down as if sitting in a chair.', ar: 'اخفض وركيك للخلف ولأسفل كما لو كنت تجلس على كرسي.' },
            { en: 'Go as low as you can while keeping your back straight.', ar: 'انزل إلى أقصى حد ممكن مع الحفاظ على استقامة ظهرك.' },
            { en: 'Push through your heels to return to the starting position.', ar: 'ادفع من خلال كعبيك للعودة إلى وضع البداية.' },
        ],
        muscleGroup: { en: 'Quadriceps, Glutes, Hamstrings', ar: 'عضلات الفخذ الأمامية، الأرداف، أوتار الركبة' },
        difficulty: 'beginner',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif',
        videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U'
    },
    {
        id: 3,
        name: { en: 'Dumbbell Bench Press', ar: 'تمرين ضغط البنش بالدمبل' },
        description: {
            en: 'A key exercise for building chest muscle (pectorals), also involving shoulders and triceps.',
            ar: 'تمرين رئيسي لبناء عضلات الصدر، ويشرك أيضًا الكتفين والترايسبس.'
        },
        instructions: [
            { en: 'Lie on a flat bench with a dumbbell in each hand, resting on your thighs.', ar: 'استلقِ على بنش مسطح مع دمبل في كل يد، مستريحًا على فخذيك.' },
            { en: 'Lift the dumbbells one at a time so they are positioned at your shoulders.', ar: 'ارفع الدمبلز واحدًا تلو الآخر بحيث تكون عند كتفيك.' },
            { en: 'Push the dumbbells up until your arms are fully extended.', ar: 'ادفع الدمبلز لأعلى حتى تمتد ذراعاك بالكامل.' },
            { en: 'Lower the dumbbells slowly and controllably to the sides of your chest.', ar: 'اخفض الدمبلز ببطء وتحكم إلى جانبي صدرك.' },
        ],
        muscleGroup: { en: 'Chest (Pectorals)', ar: 'الصدر' },
        difficulty: 'intermediate',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif',
        videoUrl: 'https://www.youtube.com/embed/Y_7aHqXeCfM'
    },
    {
        id: 4,
        name: { en: 'Deadlift', ar: 'تمرين الرفعة المميتة' },
        description: {
            en: 'A compound exercise that works the entire posterior chain, including the back, glutes, and hamstrings.',
            ar: 'تمرين مركب يعمل على السلسلة الخلفية بأكملها، بما في ذلك الظهر والأرداف وأوتار الركبة.'
        },
        instructions: [
            { en: 'Stand with your mid-foot under the barbell.', ar: 'قف مع منتصف قدمك تحت البار.' },
            { en: 'Bend over and grab the bar with a shoulder-width grip.', ar: 'انحنِ وأمسك البار بقبضة بعرض الكتفين.' },
            { en: 'Bend your knees until your shins touch the bar.', ar: 'اثنِ ركبتيك حتى تلمس قصبة الساق البار.' },
            { en: 'Lift your chest up and straighten your lower back.', ar: 'ارفع صدرك لأعلى وافرد أسفل ظهرك.' },
            { en: 'Lift the weight by extending your hips and knees, keeping the bar close to your body.', ar: 'ارفع الوزن عن طريق مد الوركين والركبتين، مع إبقاء البار قريبًا من جسمك.' },
        ],
        muscleGroup: { en: 'Full Body, Back, Glutes', ar: 'الجسم بالكامل، الظهر، الأرداف' },
        difficulty: 'advanced',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Deadlift.gif',
        videoUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE'
    },
    {
        id: 5,
        name: { en: 'Plank', ar: 'تمرين البلانك' },
        description: {
            en: 'An isometric core strength exercise that involves maintaining a position similar to a push-up for the maximum possible time.',
            ar: 'تمرين قوة متساوي القياس للجذع يتضمن الحفاظ على وضعية تشبه تمرين الضغط لأقصى وقت ممكن.'
        },
        instructions: [
            { en: 'Place your forearms on the ground with elbows aligned below the shoulders.', ar: 'ضع ساعديك على الأرض مع محاذاة المرفقين أسفل الكتفين.' },
            { en: 'Your arms should be parallel to the body at about shoulder-width distance.', ar: 'يجب أن تكون ذراعاك متوازيتين مع الجسم على مسافة عرض الكتفين تقريبًا.' },
            { en: 'Hold the position, keeping your core tight and your body in a straight line from head to heels.', ar: 'حافظ على الوضعية، مع إبقاء جذعك مشدودًا وجسمك في خط مستقيم من الرأس إلى الكعبين.' },
        ],
        muscleGroup: { en: 'Core (Abdominals)', ar: 'الجذع (عضلات البطن)' },
        difficulty: 'beginner',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/05/Plank.gif',
        videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c'
    },
    {
        id: 6,
        name: { en: 'Bicep Curl', ar: 'تمرين البايسبس' },
        description: {
            en: 'An isolation exercise that targets the biceps muscles in the upper arm.',
            ar: 'تمرين عزل يستهدف عضلات البايسبس في الجزء العلوي من الذراع.'
        },
        instructions: [
            { en: 'Stand or sit holding a dumbbell in each hand with an underhand grip.', ar: 'قف أو اجلس ممسكًا بدمبل في كل يد بقبضة سفلية.' },
            { en: 'Curl the weights up towards your shoulders, squeezing your biceps.', ar: 'ارفع الأوزان نحو كتفيك، مع عصر عضلة البايسبس.' },
            { en: 'Keep your elbows stationary at your sides.', ar: 'حافظ على ثبات مرفقيك على جانبيك.' },
            { en: 'Lower the weights slowly back to the starting position.', ar: 'اخفض الأوزان ببطء مرة أخرى إلى وضع البداية.' },
        ],
        muscleGroup: { en: 'Biceps', ar: 'البايسبس' },
        difficulty: 'beginner',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bicep-Curl.gif',
        videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo'
    },
    {
        id: 7,
        name: { en: 'Pull-up', ar: 'تمرين العقلة' },
        description: {
            en: 'A challenging upper-body exercise where you lift your own body weight. It primarily works the back and biceps.',
            ar: 'تمرين صعب للجزء العلوي من الجسم حيث ترفع وزن جسمك. يعمل بشكل أساسي على الظهر والبايسبس.'
        },
        instructions: [
            { en: 'Grab the pull-up bar with your palms facing away from you, slightly wider than shoulder-width.', ar: 'أمسك بقضيب العقلة مع توجيه راحتي يديك بعيدًا عنك، أعرض قليلاً من عرض الكتفين.' },
            { en: 'Hang from the bar with your arms fully extended.', ar: 'تدلى من القضيب مع تمديد ذراعيك بالكامل.' },
            { en: 'Pull your body up until your chin is over the bar.', ar: 'اسحب جسمك لأعلى حتى يتجاوز ذقنك القضيب.' },
            { en: 'Lower your body slowly until your arms are fully extended again.', ar: 'اخفض جسمك ببطء حتى تمتد ذراعاك بالكامل مرة أخرى.' },
        ],
        muscleGroup: { en: 'Back (Lats), Biceps', ar: 'الظهر (العضلة الظهرية العريضة)، البايسبس' },
        difficulty: 'advanced',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
        videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g'
    },
    {
        id: 8,
        name: { en: 'Lunge', ar: 'تمرين الطعن (لنجز)' },
        description: {
            en: 'A single-leg bodyweight exercise that works your hips, glutes, quads, hamstrings, and core.',
            ar: 'تمرين بوزن الجسم لساق واحدة يعمل على الوركين والأرداف وعضلات الفخذ الأمامية وأوتار الركبة والجذع.'
        },
        instructions: [
            { en: 'Step forward with one leg, lowering your hips until both knees are bent at a 90-degree angle.', ar: 'اخطُ للأمام بساق واحدة، واخفض وركيك حتى تنثني كلتا الركبتين بزاوية 90 درجة.' },
            { en: 'Make sure your front knee is directly above your ankle and your other knee doesn\'t touch the floor.', ar: 'تأكد من أن ركبتك الأمامية فوق كاحلك مباشرة وأن ركبتك الأخرى لا تلمس الأرض.' },
            { en: 'Push off your front foot to return to the starting position.', ar: 'ادفع بقدمك الأمامية للعودة إلى وضع البداية.' },
            { en: 'Repeat on the other side.', ar: 'كرر على الجانب الآخر.' },
        ],
        muscleGroup: { en: 'Legs, Glutes', ar: 'الساقين، الأرداف' },
        difficulty: 'beginner',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/05/Bodyweight-Lunge.gif',
        videoUrl: 'https://www.youtube.com/embed/QO_oO14zaM4'
    },
    {
        id: 9,
        name: { en: 'Jumping Jacks', ar: 'قفز الرافعات' },
        description: { en: 'A full-body cardiovascular exercise that involves jumping to a position with the legs spread wide and the hands touching overhead.', ar: 'تمرين قلبي وعائي لكامل الجسم يتضمن القفز إلى وضع مع تباعد الساقين على نطاق واسع ولمس اليدين فوق الرأس.' },
        instructions: [
            { en: 'Stand upright with your legs together and arms at your sides.', ar: 'قف بشكل مستقيم مع ضم ساقيك وذراعيك على جانبيك.' },
            { en: 'Bend your knees slightly, and jump into the air.', ar: 'اثنِ ركبتيك قليلاً، واقفز في الهواء.' },
            { en: 'As you jump, spread your legs to be about shoulder-width apart and stretch your arms out and over your head.', ar: 'أثناء القفز، باعد بين ساقيك بعرض الكتفين تقريبًا ومد ذراعيك للخارج وفوق رأسك.' },
            { en: 'Jump back to the starting position.', ar: 'اقفز مرة أخرى إلى وضع البداية.' }
        ],
        muscleGroup: { en: 'Full Body, Cardio', ar: 'الجسم بالكامل، كارديو' },
        difficulty: 'beginner',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/05/Jumping-Jack.gif',
        videoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8'
    },
    {
        id: 10,
        name: { en: 'Crunches', ar: 'تمرين البطن (كرانشز)' },
        description: { en: 'A classic abdominal exercise that targets the rectus abdominis muscle.', ar: 'تمرين بطن كلاسيكي يستهدف العضلة المستقيمة البطنية.' },
        instructions: [
            { en: 'Lie on your back with your knees bent and feet flat on the floor.', ar: 'استلقِ على ظهرك مع ثني ركبتيك وقدميك مسطحة على الأرض.' },
            { en: 'Place your hands behind your head or across your chest.', ar: 'ضع يديك خلف رأسك أو متقاطعتين على صدرك.' },
            { en: 'Lift your head and shoulders off the floor, engaging your abs.', ar: 'ارفع رأسك وكتفيك عن الأرض، مع شد عضلات بطنك.' },
            { en: 'Lower back down slowly.', ar: 'انزل ببطء.' }
        ],
        muscleGroup: { en: 'Abdominals', ar: 'عضلات البطن' },
        difficulty: 'beginner',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif',
        videoUrl: 'https://www.youtube.com/embed/Xyd_fa5zoEU'
    },
    {
        id: 11,
        name: { en: 'Mountain Climbers', ar: 'تمرين متسلق الجبال' },
        description: { en: 'A dynamic, full-body exercise that builds cardio endurance, core strength, and agility.', ar: 'تمرين ديناميكي لكامل الجسم يبني القدرة على التحمل القلبي وقوة الجذع والرشاقة.' },
        instructions: [
            { en: 'Start in a plank position.', ar: 'ابدأ في وضعية البلانك.' },
            { en: 'Bring your right knee towards your chest, then return it to the start.', ar: 'اجلب ركبتك اليمنى نحو صدرك، ثم أعدها إلى البداية.' },
            { en: 'Bring your left knee towards your chest, and return it.', ar: 'اجلب ركبتك اليسرى نحو صدرك، وأعدها.' },
            { en: 'Continue alternating legs at a fast pace.', ar: 'استمر في تبديل الساقين بوتيرة سريعة.' }
        ],
        muscleGroup: { en: 'Core, Cardio, Full Body', ar: 'الجذع، كارديو، الجسم بالكامل' },
        difficulty: 'intermediate',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/05/Mountain-Climber.gif',
        videoUrl: 'https://www.youtube.com/embed/cnyTQDSE884'
    },
    {
        id: 12,
        name: { en: 'Burpees', ar: 'تمرين البيربي' },
        description: { en: 'A full-body strength and aerobic exercise. It is performed in four steps: squat, plank, push-up, and jump.', ar: 'تمرين قوة هوائي لكامل الجسم. يتم إجراؤه في أربع خطوات: القرفصاء، والبلانك، والضغط، والقفز.' },
        instructions: [
            { en: 'Start in a squat position with your hands on the floor in front of you.', ar: 'ابدأ في وضع القرفصاء مع وضع يديك على الأرض أمامك.' },
            { en: 'Kick your feet back to a push-up position.', ar: 'اركل قدميك للخلف إلى وضع الضغط.' },
            { en: 'Immediately return your feet to the squat position.', ar: 'أعد قدميك على الفور إلى وضع القرفصاء.' },
            { en: 'Leap up as high as possible from the squat position.', ar: 'اقفز لأعلى ما يمكن من وضع القرفصاء.' }
        ],
        muscleGroup: { en: 'Full Body, Cardio', ar: 'الجسم بالكامل، كارديو' },
        difficulty: 'advanced',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/08/Burpee.gif',
        videoUrl: 'https://www.youtube.com/embed/auBLPXO8Fww'
    },
    {
        id: 13,
        name: { en: 'Dumbbell Row', ar: 'تجديف الدمبل' },
        description: { en: 'A great exercise for building a strong and muscular back, also hitting the biceps.', ar: 'تمرين رائع لبناء ظهر قوي وعضلي، ويؤثر أيضًا على البايسبس.' },
        instructions: [
            { en: 'Place one knee and the same-side hand on a bench.', ar: 'ضع ركبة واحدة ويد من نفس الجانب على بنش.' },
            { en: 'Hold a dumbbell in the opposite hand with your arm extended.', ar: 'أمسك دمبل في اليد المقابلة مع تمديد ذراعك.' },
            { en: 'Pull the dumbbell up to the side of your chest, squeezing your back muscles.', ar: 'اسحب الدمبل لأعلى إلى جانب صدرك، مع عصر عضلات ظهرك.' },
            { en: 'Lower the dumbbell slowly until your arm is fully extended.', ar: 'اخفض الدمبل ببطء حتى تمتد ذراعك بالكامل.' }
        ],
        muscleGroup: { en: 'Back, Biceps', ar: 'الظهر، البايسبس' },
        difficulty: 'intermediate',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif',
        videoUrl: 'https://www.youtube.com/embed/pYcpY20QaE8'
    },
    {
        id: 14,
        name: { en: 'Dumbbell Overhead Press', ar: 'ضغط الكتف بالدمبل' },
        description: { en: 'A fundamental shoulder-building exercise that also strengthens the triceps and core.', ar: 'تمرين أساسي لبناء الكتف يقوي أيضًا الترايسبس والجذع.' },
        instructions: [
            { en: 'Sit or stand with a dumbbell in each hand at shoulder height, palms facing forward.', ar: 'اجلس أو قف مع دمبل في كل يد عند ارتفاع الكتف، مع توجيه راحتي اليدين للأمام.' },
            { en: 'Press the dumbbells overhead until your arms are fully extended.', ar: 'ادفع الدمبلز فوق رأسك حتى تمتد ذراعاك بالكامل.' },
            { en: 'Do not lock your elbows at the top.', ar: 'لا تقفل مرفقيك في الأعلى.' },
            { en: 'Lower the dumbbells slowly back to shoulder height.', ar: 'اخفض الدمبلز ببطء مرة أخرى إلى ارتفاع الكتف.' }
        ],
        muscleGroup: { en: 'Shoulders, Triceps', ar: 'الكتفين، الترايسبس' },
        difficulty: 'intermediate',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
        videoUrl: 'https://www.youtube.com/embed/M2rwvNC1m-0'
    },
    {
        id: 15,
        name: { en: 'Glute Bridge', ar: 'تمرين جسر الأرداف' },
        description: {
            en: 'An excellent exercise for strengthening the gluteal muscles and hamstrings, as well as the core.',
            ar: 'تمرين ممتاز لتقوية عضلات الأرداف وأوتار الركبة، بالإضافة إلى الجذع.'
        },
        instructions: [
            { en: 'Lie on your back with your knees bent, feet flat on the floor, and arms at your sides.', ar: 'استلقِ على ظهرك مع ثني ركبتيك، وقدميك مسطحة على الأرض، وذراعيك على جانبيك.' },
            { en: 'Lift your hips off the floor until your body forms a straight line from your shoulders to your knees.', ar: 'ارفع وركيك عن الأرض حتى يشكل جسمك خطًا مستقيمًا من كتفيك إلى ركبتيك.' },
            { en: 'Squeeze your glutes at the top of the movement.', ar: 'اعصر عضلات أردافك في أعلى الحركة.' },
            { en: 'Lower your hips back down to the starting position.', ar: 'اخفض وركيك مرة أخرى إلى وضع البداية.' },
        ],
        muscleGroup: { en: 'Glutes, Hamstrings', ar: 'الأرداف، أوتار الركبة' },
        difficulty: 'beginner',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/08/Glute-Bridge.gif',
        videoUrl: 'https://www.youtube.com/embed/8bbE64NuDTU'
    },
    {
        id: 16,
        name: { en: 'Leg Raises', ar: 'تمرين رفع الساق' },
        description: {
            en: 'A core exercise that primarily targets the lower abdominal muscles.',
            ar: 'تمرين للجذع يستهدف بشكل أساسي عضلات البطن السفلية.'
        },
        instructions: [
            { en: 'Lie on your back with your legs straight and together.', ar: 'استلقِ على ظهرك مع ساقيك مستقيمتين ومضمومتين.' },
            { en: 'Place your hands under your lower back for support.', ar: 'ضع يديك تحت أسفل ظهرك للدعم.' },
            { en: 'Slowly raise your legs to a 90-degree angle, keeping them straight.', ar: 'ارفع ساقيك ببطء إلى زاوية 90 درجة، مع إبقائهما مستقيمتين.' },
            { en: 'Lower your legs back down slowly without letting them touch the floor.', ar: 'اخفض ساقيك ببطء مرة أخرى دون أن تلمس الأرض.' },
        ],
        muscleGroup: { en: 'Abdominals', ar: 'عضلات البطن' },
        difficulty: 'beginner',
        imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif',
        videoUrl: 'https://www.youtube.com/embed/l4kQd9eWclE'
    }
];