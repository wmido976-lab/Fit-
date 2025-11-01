
import type { FoodItem } from '../types';

export const foodData: FoodItem[] = [
    {
        id: 1,
        name: { en: 'Koshari', ar: 'كشري' },
        category: 'carbohydrates',
        description: { en: 'Iconic Egyptian street food with rice, pasta, and lentils.', ar: 'طبق الشارع المصري الشهير المكون من الأرز والمكرونة والعدس.' },
        nutrition: { calories: 158, protein: 6, carbs: 30, fat: 2 },
        details: {
            benefits: { en: 'High in plant-based protein and fiber. Provides sustained energy.', ar: 'غني بالبروتين النباتي والألياف. يوفر طاقة مستدامة.' },
            recommendation: { en: 'A complete and affordable meal. Best enjoyed with spicy tomato sauce and fried onions.', ar: 'وجبة كاملة وبأسعار معقولة. يفضل الاستمتاع بها مع صلصة الطماطم الحارة والبصل المقلي.' },
            allergens: { en: 'Contains gluten (pasta).', ar: 'يحتوي على الغلوتين (المكرونة).' }
        }
    },
    {
        id: 2,
        name: { en: 'Ful Medames', ar: 'فول مدمس' },
        category: 'proteins',
        description: { en: 'Slow-cooked fava beans, a staple breakfast in Egypt.', ar: 'فول مطبوخ ببطء، وجبة إفطار أساسية في مصر.' },
        nutrition: { calories: 88, protein: 6, carbs: 13, fat: 1 },
        details: {
            benefits: { en: 'Excellent source of protein, fiber, and iron. Keeps you full for hours.', ar: 'مصدر ممتاز للبروتين والألياف والحديد. يبقيك شبعانًا لساعات.' },
            recommendation: { en: 'Season with olive oil, cumin, and lemon juice. Served with Aish Baladi.', ar: 'يتبل بزيت الزيتون والكمون وعصير الليمون. يقدم مع العيش البلدي.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 3,
        name: { en: 'Ta\'ameya (Falafel)', ar: 'طعمية (فلافل)' },
        category: 'proteins',
        description: { en: 'Egyptian falafel made from fava beans, not chickpeas.', ar: 'فلافل مصرية مصنوعة من الفول المدشوش، وليس الحمص.' },
        nutrition: { calories: 333, protein: 13, carbs: 32, fat: 18 },
        details: {
            benefits: { en: 'Great source of vegetarian protein and fiber.', ar: 'مصدر رائع للبروتين النباتي والألياف.' },
            recommendation: { en: 'Typically served in pita bread with tahini and salad. Healthier when baked instead of fried.', ar: 'تقدم عادة في الخبز مع الطحينة والسلطة. تكون صحية أكثر عند خبزها بدلاً من قليها.' },
            allergens: { en: 'None, unless fried in contaminated oil.', ar: 'لا يوجد، ما لم يتم قليها في زيت ملوث.' }
        }
    },
    {
        id: 4,
        name: { en: 'Molokhia', ar: 'ملوخية' },
        category: 'vegetables',
        description: { en: 'A traditional green soup made from jute leaves.', ar: 'شوربة خضراء تقليدية مصنوعة من أوراق الملوخية.' },
        nutrition: { calories: 65, protein: 4, carbs: 7, fat: 3 },
        details: {
            benefits: { en: 'Rich in vitamins A and C, iron, and antioxidants. Believed to aid digestion.', ar: 'غنية بفيتامينات أ و ج والحديد ومضادات الأكسدة. يعتقد أنها تساعد في الهضم.' },
            recommendation: { en: 'Served with rice or bread, often with chicken or rabbit.', ar: 'تقدم مع الأرز أو الخبز، وغالباً مع الدجاج أو الأرانب.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 5,
        name: { en: 'Fattah', ar: 'فتة' },
        category: 'carbohydrates',
        description: { en: 'A celebratory dish of rice, bread, and meat in a garlic-vinegar sauce.', ar: 'طبق احتفالي من الأرز والخبز واللحم في صلصة الثوم والخل.' },
        nutrition: { calories: 250, protein: 15, carbs: 25, fat: 10 },
        details: {
            benefits: { en: 'A hearty meal providing a good balance of macronutrients.', ar: 'وجبة دسمة توفر توازناً جيداً من المغذيات الكبيرة.' },
            recommendation: { en: 'Common during Eid al-Adha. A rich dish, so portion control is key.', ar: 'شائعة خلال عيد الأضحى. طبق غني، لذا فإن التحكم في الحصص هو المفتاح.' },
            allergens: { en: 'Gluten (bread).', ar: 'الغلوتين (الخبز).' }
        }
    },
    {
        id: 6,
        name: { en: 'Mahshi', ar: 'محشي' },
        category: 'vegetables',
        description: { en: 'Vegetables (grape leaves, cabbage, zucchini) stuffed with a rice mixture.', ar: 'خضروات (ورق عنب، كرنب، كوسة) محشوة بخليط الأرز.' },
        nutrition: { calories: 150, protein: 4, carbs: 20, fat: 6 },
        details: {
            benefits: { en: 'Combines vegetables and carbohydrates. Can be made healthier with less oil and lean meat.', ar: 'يجمع بين الخضروات والكربوهيدرات. يمكن جعله صحيًا أكثر بقليل من الزيت واللحم الخالي من الدهون.' },
            recommendation: { en: 'A family favorite. The rice stuffing can be customized with herbs and spices.', ar: 'مفضل لدى العائلات. يمكن تخصيص حشوة الأرز بالأعشاب والتوابل.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 7,
        name: { en: 'Hawawshi', ar: 'حواوشي' },
        category: 'carbohydrates',
        description: { en: 'Spiced minced meat baked inside traditional Egyptian bread.', ar: 'لحم مفروم متبل مخبوز داخل الخبز المصري التقليدي.' },
        nutrition: { calories: 300, protein: 14, carbs: 28, fat: 15 },
        details: {
            benefits: { en: 'A flavorful and satisfying source of protein and carbs.', ar: 'مصدر لذيذ ومشبع للبروتين والكربوهيدرات.' },
            recommendation: { en: 'Use lean ground beef to reduce fat content. Serve with yogurt and salad.', ar: 'استخدم لحمًا مفرومًا قليل الدهن لتقليل محتوى الدهون. يقدم مع الزبادي والسلطة.' },
            allergens: { en: 'Gluten (bread).', ar: 'الغلوتين (الخبز).' }
        }
    },
    {
        id: 8,
        name: { en: 'Kofta Kebab', ar: 'كفتة كباب' },
        category: 'proteins',
        description: { en: 'Grilled skewers of seasoned minced meat.', ar: 'أسياخ من اللحم المفروم المتبل والمشوي.' },
        nutrition: { calories: 250, protein: 20, carbs: 3, fat: 18 },
        details: {
            benefits: { en: 'High in protein. Grilling is a healthier cooking method than frying.', ar: 'غني بالبروتين. الشوي طريقة طهي صحية أكثر من القلي.' },
            recommendation: { en: 'Serve with tahini, salad, and bread for a balanced meal.', ar: 'تقدم مع الطحينة والسلطة والخبز لوجبة متوازنة.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 9,
        name: { en: 'Kebda Eskandarani', ar: 'كبدة إسكندراني' },
        category: 'proteins',
        description: { en: 'Alexandrian-style pan-fried beef liver with spicy peppers.', ar: 'كبدة بقري مقلية على الطريقة الإسكندرانية مع الفلفل الحار.' },
        nutrition: { calories: 200, protein: 22, carbs: 5, fat: 10 },
        details: {
            benefits: { en: 'Extremely rich in iron, Vitamin A, and B vitamins.', ar: 'غنية جدًا بالحديد وفيتامين أ وفيتامينات ب.' },
            recommendation: { en: 'A popular street food sandwich. High in cholesterol, so consume in moderation.', ar: 'شطيرة طعام شارع شهيرة. عالية في الكوليسترول، لذا تستهلك باعتدال.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 10,
        name: { en: 'Besara', ar: 'بصارة' },
        category: 'proteins',
        description: { en: 'A traditional green puree of fava beans and herbs.', ar: 'هريس أخضر تقليدي من الفول المدشوش والأعشاب.' },
        nutrition: { calories: 130, protein: 8, carbs: 15, fat: 4 },
        details: {
            benefits: { en: 'Vegan, high in fiber and plant-based protein. Very nutritious.', ar: 'نباتي، غني بالألياف والبروتين النباتي. مغذي جدًا.' },
            recommendation: { en: 'Often served cold as a dip or a main dish, topped with fried onions.', ar: 'غالبًا ما تقدم باردة كغموس أو طبق رئيسي، مغطاة بالبصل المقلي.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 11,
        name: { en: 'Shakshouka', ar: 'شكشوكة' },
        category: 'proteins',
        description: { en: 'Eggs poached in a hearty, spiced tomato and pepper sauce.', ar: 'بيض مسلوق في صلصة طماطم وفلفل غنية ومتبلة.' },
        nutrition: { calories: 120, protein: 8, carbs: 7, fat: 7 },
        details: {
            benefits: { en: 'Combines protein from eggs and vitamins from vegetables.', ar: 'يجمع بين البروتين من البيض والفيتامينات من الخضروات.' },
            recommendation: { en: 'A versatile meal for breakfast, lunch, or dinner. Great with crusty bread.', ar: 'وجبة متعددة الاستخدامات للإفطار أو الغداء أو العشاء. رائعة مع الخبز المحمص.' },
            allergens: { en: 'Eggs.', ar: 'بيض.' }
        }
    },
    {
        id: 12,
        name: { en: 'Bamia (Okra Stew)', ar: 'بامية' },
        category: 'vegetables',
        description: { en: 'Okra cooked in a rich tomato and meat stew.', ar: 'بامية مطبوخة في يخنة طماطم ولحم غنية.' },
        nutrition: { calories: 180, protein: 12, carbs: 10, fat: 10 },
        details: {
            benefits: { en: 'Okra is a good source of fiber, vitamin C, and folate.', ar: 'البامية مصدر جيد للألياف وفيتامين ج والفولات.' },
            recommendation: { en: 'Traditionally made with lamb or beef. A vegetarian version is also popular.', ar: 'تصنع تقليديًا بلحم الضأن أو البقر. النسخة النباتية شائعة أيضًا.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 13,
        name: { en: 'Roz Bel Laban', ar: 'أرز باللبن' },
        category: 'snacks',
        description: { en: 'A sweet and creamy Egyptian rice pudding.', ar: 'بودنغ الأرز المصري الحلو والكريمي.' },
        nutrition: { calories: 150, protein: 3, carbs: 28, fat: 3 },
        details: {
            benefits: { en: 'Provides quick energy from carbohydrates and calcium from milk.', ar: 'يوفر طاقة سريعة من الكربوهيدرات والكالسيوم من الحليب.' },
            recommendation: { en: 'A popular dessert served cold, often topped with nuts, raisins, or cinnamon.', ar: 'حلوى شهيرة تقدم باردة، غالبًا ما تزين بالمكسرات أو الزبيب أو القرفة.' },
            allergens: { en: 'Dairy.', ar: 'ألبان.' }
        }
    },
    {
        id: 14,
        name: { en: 'Om Ali', ar: 'أم علي' },
        category: 'snacks',
        description: { en: 'A national dessert; a type of bread pudding with pastry, milk, and nuts.', ar: 'حلوى وطنية؛ نوع من بودنغ الخبز مع المعجنات والحليب والمكسرات.' },
        nutrition: { calories: 350, protein: 8, carbs: 40, fat: 18 },
        details: {
            benefits: { en: 'A rich and comforting dessert. Source of calcium and energy.', ar: 'حلوى غنية ومريحة. مصدر للكالسيوم والطاقة.' },
            recommendation: { en: 'Very decadent and high in calories; best for special occasions.', ar: 'فاخرة جدًا وعالية السعرات الحرارية؛ الأفضل للمناسبات الخاصة.' },
            allergens: { en: 'Gluten, Dairy, Nuts.', ar: 'الغلوتين، الألبان، المكسرات.' }
        }
    },
    {
        id: 15,
        name: { en: 'Basbousa', ar: 'بسبوسة' },
        category: 'snacks',
        description: { en: 'A sweet semolina cake soaked in simple syrup.', ar: 'كيكة سميد حلوة مغموسة في شراب السكر.' },
        nutrition: { calories: 300, protein: 4, carbs: 50, fat: 10 },
        details: {
            benefits: { en: 'Provides a quick boost of energy due to its high sugar content.', ar: 'يوفر دفعة سريعة من الطاقة بسبب محتواه العالي من السكر.' },
            recommendation: { en: 'Very sweet dessert. Enjoy in small portions.', ar: 'حلوى حلوة جدًا. استمتع بها في حصص صغيرة.' },
            allergens: { en: 'Gluten, Dairy. May contain nuts.', ar: 'الغلوتين، الألبان. قد تحتوي على مكسرات.' }
        }
    },
    {
        id: 16,
        name: { en: 'Konafa', ar: 'كنافة' },
        category: 'snacks',
        description: { en: 'A dessert made with shredded phyllo pastry, cheese or cream, and syrup.', ar: 'حلوى مصنوعة من عجينة الكنافة، والجبن أو القشطة، والشراب.' },
        nutrition: { calories: 400, protein: 8, carbs: 55, fat: 18 },
        details: {
            benefits: { en: 'A rich source of energy.', ar: 'مصدر غني بالطاقة.' },
            recommendation: { en: 'Extremely popular during Ramadan. Very high in sugar and fat.', ar: 'شعبية للغاية خلال شهر رمضان. عالية جدًا في السكر والدهون.' },
            allergens: { en: 'Gluten, Dairy. Often contains nuts.', ar: 'الغلوتين، الألبان. غالبًا ما تحتوي على مكسرات.' }
        }
    },
    {
        id: 17,
        name: { en: 'Macarona Béchamel', ar: 'مكرونة بالبشاميل' },
        category: 'carbohydrates',
        description: { en: 'Egyptian baked pasta casserole with minced meat and béchamel sauce.', ar: 'طاجن مكرونة مصري مخبوز مع لحم مفروم وصلصة البشاميل.' },
        nutrition: { calories: 280, protein: 12, carbs: 25, fat: 15 },
        details: {
            benefits: { en: 'A complete meal with protein, carbs, and dairy.', ar: 'وجبة كاملة تحتوي على البروتين والكربوهيدرات والألبان.' },
            recommendation: { en: 'A heavy and comforting dish. Use skim milk and lean meat for a lighter version.', ar: 'طبق ثقيل ومريح. استخدم الحليب خالي الدسم واللحم قليل الدهن لنسخة أخف.' },
            allergens: { en: 'Gluten, Dairy.', ar: 'الغلوتين، الألبان.' }
        }
    },
    {
        id: 18,
        name: { en: 'Feteer Meshaltet', ar: 'فطير مشلتت' },
        category: 'carbohydrates',
        description: { en: 'A flaky, layered pastry made with many thin layers of dough and ghee.', ar: 'فطيرة هشة متعددة الطبقات مصنوعة من طبقات رقيقة من العجين والسمن.' },
        nutrition: { calories: 450, protein: 6, carbs: 50, fat: 25 },
        details: {
            benefits: { en: 'Provides significant energy from fats and carbohydrates.', ar: 'يوفر طاقة كبيرة من الدهون والكربوهيدرات.' },
            recommendation: { en: 'Traditionally eaten with honey, molasses, or cheese. Very high in fat.', ar: 'يؤكل تقليديًا مع العسل أو العسل الأسود أو الجبن. عالي جدًا في الدهون.' },
            allergens: { en: 'Gluten, Dairy (ghee).', ar: 'الغلوتين، الألبان (السمن).' }
        }
    },
    {
        id: 19,
        name: { en: 'Aish Baladi', ar: 'عيش بلدي' },
        category: 'carbohydrates',
        description: { en: 'Traditional Egyptian whole wheat pita bread.', ar: 'خبز البيتا المصري التقليدي من القمح الكامل.' },
        nutrition: { calories: 250, protein: 9, carbs: 50, fat: 2 },
        details: {
            benefits: { en: 'A good source of fiber and complex carbohydrates.', ar: 'مصدر جيد للألياف والكربوهيدرات المعقدة.' },
            recommendation: { en: 'The cornerstone of almost every Egyptian meal.', ar: 'حجر الزاوية في كل وجبة مصرية تقريبًا.' },
            allergens: { en: 'Gluten.', ar: 'الغلوتين.' }
        }
    },
    {
        id: 20,
        name: { en: 'Torly', ar: 'تورلي' },
        category: 'vegetables',
        description: { en: 'A baked casserole of mixed vegetables and meat.', ar: 'طاجن مخبوز من الخضروات المشكلة واللحم.' },
        nutrition: { calories: 180, protein: 10, carbs: 12, fat: 9 },
        details: {
            benefits: { en: 'A great way to eat a variety of vegetables in one dish.', ar: 'طريقة رائعة لتناول مجموعة متنوعة من الخضروات في طبق واحد.' },
            recommendation: { en: 'Potatoes, zucchini, carrots, and peas are commonly used. Can be made vegetarian.', ar: 'تستخدم البطاطس والكوسة والجزر والبازلاء بشكل شائع. يمكن أن تكون نباتية.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 21,
        name: { en: 'Kaware\'', ar: 'كوارع' },
        category: 'proteins',
        description: { en: 'Slow-cooked cow\'s feet, often served in a soup.', ar: 'أقدام البقر المطبوخة ببطء، غالبًا ما تقدم في شوربة.' },
        nutrition: { calories: 220, protein: 25, carbs: 0, fat: 14 },
        details: {
            benefits: { en: 'Extremely rich in collagen, which is good for skin, hair, and joint health.', ar: 'غنية جدًا بالكولاجين، وهو مفيد لصحة الجلد والشعر والمفاصل.' },
            recommendation: { en: 'An acquired taste. The broth is highly nutritious.', ar: 'ذوق مكتسب. المرق مغذي للغاية.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 22,
        name: { en: 'Mombar', ar: 'ممبار' },
        category: 'carbohydrates',
        description: { en: 'Sausage casings stuffed with a rice and herb mixture, then fried.', ar: 'أغلفة سجق محشوة بخليط الأرز والأعشاب، ثم تقلى.' },
        nutrition: { calories: 250, protein: 8, carbs: 22, fat: 14 },
        details: {
            benefits: { en: 'A flavorful dish combining carbs and fats for energy.', ar: 'طبق لذيذ يجمع بين الكربوهيدرات والدهون للطاقة.' },
            recommendation: { en: 'High in fat due to frying. Can be boiled for a slightly healthier option.', ar: 'عالي الدهون بسبب القلي. يمكن سلقه للحصول على خيار صحي أكثر قليلاً.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 23,
        name: { en: 'Hamam Mahshi', ar: 'حمام محشي' },
        category: 'proteins',
        description: { en: 'Pigeon stuffed with seasoned rice or freekeh, then roasted.', ar: 'حمام محشو بالأرز المتبل أو الفريك، ثم يشوى.' },
        nutrition: { calories: 350, protein: 20, carbs: 25, fat: 18 },
        details: {
            benefits: { en: 'Pigeon is a lean source of protein, rich in iron and B vitamins.', ar: 'الحمام مصدر قليل الدهن للبروتين، غني بالحديد وفيتامينات ب.' },
            recommendation: { en: 'A delicacy in Egyptian cuisine, often served at weddings.', ar: 'من أطايب المطبخ المصري، غالبًا ما يقدم في حفلات الزفاف.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 24,
        name: { en: 'Sayadeya Fish', ar: 'سمك صيادية' },
        category: 'proteins',
        description: { en: 'Fish (often white fish) served with a spiced, caramelized onion rice.', ar: 'سمك (غالبًا سمك أبيض) يقدم مع أرز بالبصل المكرمل والمتبل.' },
        nutrition: { calories: 220, protein: 18, carbs: 20, fat: 8 },
        details: {
            benefits: { en: 'Provides lean protein and healthy omega-3 fatty acids.', ar: 'يوفر بروتينًا قليل الدهن وأحماض أوميغا 3 الدهنية الصحية.' },
            recommendation: { en: 'A specialty of coastal cities like Alexandria and Port Said.', ar: 'من تخصصات المدن الساحلية مثل الإسكندرية وبورسعيد.' },
            allergens: { en: 'Fish.', ar: 'سمك.' }
        }
    },
    {
        id: 25,
        name: { en: 'Fesikh', ar: 'فسيخ' },
        category: 'proteins',
        description: { en: 'Fermented, salted, and dried grey mullet.', ar: 'بوري رمادي مخمر ومملح ومجفف.' },
        nutrition: { calories: 210, protein: 22, carbs: 0, fat: 14 },
        details: {
            benefits: { en: 'High in protein and sodium.', ar: 'غني بالبروتين والصوديوم.' },
            recommendation: { en: 'Eaten during the Sham el-Nessim festival. Must be prepared properly to avoid food poisoning.', ar: 'يؤكل خلال عيد شم النسيم. يجب تحضيره بشكل صحيح لتجنب التسمم الغذائي.' },
            allergens: { en: 'Fish.', ar: 'سمك.' }
        }
    },
    {
        id: 26,
        name: { en: 'Renga', ar: 'رنجة' },
        category: 'proteins',
        description: { en: 'Smoked herring, another popular Sham el-Nessim dish.', ar: 'رنجة مدخنة، طبق آخر شعبي في شم النسيم.' },
        nutrition: { calories: 200, protein: 18, carbs: 0, fat: 14 },
        details: {
            benefits: { en: 'Rich in omega-3 fatty acids and vitamin D.', ar: 'غنية بأحماض أوميغا 3 الدهنية وفيتامين د.' },
            recommendation: { en: 'Often served as a salad with onions, peppers, and lemon.', ar: 'غالبًا ما تقدم كسلطة مع البصل والفلفل والليمون.' },
            allergens: { en: 'Fish.', ar: 'سمك.' }
        }
    },
    {
        id: 27,
        name: { en: 'Torshi (Pickles)', ar: 'طرشي (مخلل)' },
        category: 'vegetables',
        description: { en: 'A mix of pickled vegetables, such as carrots, cucumbers, and turnips.', ar: 'مزيج من الخضروات المخللة، مثل الجزر والخيار واللفت.' },
        nutrition: { calories: 25, protein: 1, carbs: 5, fat: 0 },
        details: {
            benefits: { en: 'Low in calories. Can contain probiotics if naturally fermented.', ar: 'قليل السعرات الحرارية. يمكن أن يحتوي على بروبيوتيك إذا تم تخميره بشكل طبيعي.' },
            recommendation: { en: 'A common side dish. High in sodium, so consume in moderation.', ar: 'طبق جانبي شائع. عالي الصوديوم، لذا يستهلك باعتدال.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 28,
        name: { en: 'Baba Ghanoush', ar: 'بابا غنوج' },
        category: 'vegetables',
        description: { en: 'A dip made from roasted eggplant, tahini, lemon juice, and garlic.', ar: 'غموس مصنوع من الباذنجان المشوي والطحينة وعصير الليمون والثوم.' },
        nutrition: { calories: 80, protein: 2, carbs: 8, fat: 5 },
        details: {
            benefits: { en: 'Good source of fiber and healthy fats from tahini.', ar: 'مصدر جيد للألياف والدهون الصحية من الطحينة.' },
            recommendation: { en: 'A popular appetizer (mezze) served with pita bread.', ar: 'مقبلات (مزة) شهيرة تقدم مع الخبز.' },
            allergens: { en: 'Sesame (tahini).', ar: 'السمسم (الطحينة).' }
        }
    },
    {
        id: 29,
        name: { en: 'Tahini Salad', ar: 'سلطة طحينة' },
        category: 'snacks',
        description: { en: 'A simple, creamy sauce made from tahini, water, lemon, and spices.', ar: 'صلصة بسيطة وكريمية مصنوعة من الطحينة والماء والليمون والتوابل.' },
        nutrition: { calories: 150, protein: 5, carbs: 6, fat: 12 },
        details: {
            benefits: { en: 'Rich in healthy fats, calcium, and protein.', ar: 'غنية بالدهون الصحية والكالسيوم والبروتين.' },
            recommendation: { en: 'Served alongside grilled meats, fish, and falafel.', ar: 'تقدم بجانب اللحوم المشوية والأسماك والفلافل.' },
            allergens: { en: 'Sesame.', ar: 'السمسم.' }
        }
    },
    {
        id: 30,
        name: { en: 'Gebna Bel Tamatem', ar: 'جبنة بالطماطم' },
        category: 'dairy',
        description: { en: 'A simple salad of feta-like cheese mixed with diced tomatoes and olive oil.', ar: 'سلطة بسيطة من الجبن الشبيه بالفيتا ممزوجة بالطماطم المقطعة وزيت الزيتون.' },
        nutrition: { calories: 120, protein: 6, carbs: 4, fat: 9 },
        details: {
            benefits: { en: 'Provides calcium from cheese and lycopene from tomatoes.', ar: 'يوفر الكالسيوم من الجبن والليكوبين من الطماطم.' },
            recommendation: { en: 'A common breakfast or light dinner dish.', ar: 'طبق إفطار شائع أو عشاء خفيف.' },
            allergens: { en: 'Dairy.', ar: 'ألبان.' }
        }
    },
    {
        id: 31,
        name: { en: 'Shorbet Ads (Lentil Soup)', ar: 'شوربة عدس' },
        category: 'beverages',
        description: { en: 'A hearty and warming lentil soup, popular in winter.', ar: 'شوربة عدس دسمة ودافئة، شائعة في فصل الشتاء.' },
        nutrition: { calories: 120, protein: 7, carbs: 20, fat: 1 },
        details: {
            benefits: { en: 'High in fiber, plant-based protein, and iron. Very nutritious.', ar: 'غنية بالألياف والبروتين النباتي والحديد. مغذية جدًا.' },
            recommendation: { en: 'Often blended until smooth and served with a squeeze of lemon and toasted bread.', ar: 'غالبًا ما تخلط حتى تصبح ناعمة وتقدم مع عصرة ليمون وخبز محمص.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 32,
        name: { en: 'Shorbet Lesan Asfour', ar: 'شوربة لسان عصفور' },
        category: 'beverages',
        description: { en: 'A light soup made with orzo pasta in a chicken or beef broth.', ar: 'شوربة خفيفة مصنوعة من مكرونة لسان العصفور في مرق دجاج أو لحم.' },
        nutrition: { calories: 80, protein: 4, carbs: 12, fat: 2 },
        details: {
            benefits: { en: 'Easy to digest and hydrating. Comfort food when feeling unwell.', ar: 'سهلة الهضم ومرطبة. طعام مريح عند الشعور بالمرض.' },
            recommendation: { en: 'A common starter for a larger meal.', ar: 'مقبلات شائعة لوجبة أكبر.' },
            allergens: { en: 'Gluten.', ar: 'الغلوتين.' }
        }
    },
    {
        id: 33,
        name: { en: 'Dawood Basha', ar: 'داوود باشا' },
        category: 'proteins',
        description: { en: 'Flavorful meatballs cooked in a rich tomato sauce.', ar: 'كرات لحم لذيذة مطبوخة في صلصة طماطم غنية.' },
        nutrition: { calories: 280, protein: 18, carbs: 8, fat: 20 },
        details: {
            benefits: { en: 'A good source of protein and lycopene from the tomato sauce.', ar: 'مصدر جيد للبروتين والليكوبين من صلصة الطماطم.' },
            recommendation: { en: 'Delicious served over rice or with bread.', ar: 'لذيذة تقدم فوق الأرز أو مع الخبز.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 34,
        name: { en: 'Qolqas (Taro Stew)', ar: 'قلقاس' },
        category: 'vegetables',
        description: { en: 'A hearty winter stew made with taro root and chard.', ar: 'يخنة شتوية دسمة مصنوعة من جذر القلقاس والسلق.' },
        nutrition: { calories: 150, protein: 5, carbs: 25, fat: 4 },
        details: {
            benefits: { en: 'Taro is a good source of fiber, vitamin E, and potassium. Chard is rich in vitamins.', ar: 'القلقاس مصدر جيد للألياف وفيتامين هـ والبوتاسيوم. السلق غني بالفيتامينات.' },
            recommendation: { en: 'Often cooked in a flavorful broth with garlic.', ar: 'غالبًا ما يطبخ في مرق لذيذ مع الثوم.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 35,
        name: { en: 'Mesaka\'a', ar: 'مسقعة' },
        category: 'vegetables',
        description: { en: 'Baked layers of fried eggplant, peppers, and tomato sauce, sometimes with minced meat.', ar: 'طبقات مخبوزة من الباذنجان المقلي والفلفل وصلصة الطماطم، وأحيانًا مع اللحم المفروم.' },
        nutrition: { calories: 200, protein: 5, carbs: 15, fat: 14 },
        details: {
            benefits: { en: 'Rich in flavor and contains vitamins from the vegetables.', ar: 'غنية بالنكهة وتحتوي على فيتامينات من الخضروات.' },
            recommendation: { en: 'Baking the eggplant instead of frying can significantly reduce the fat content.', ar: 'خبز الباذنجان بدلاً من القلي يمكن أن يقلل بشكل كبير من محتوى الدهون.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 36,
        name: { en: 'Roz Me\'ammar', ar: 'أرز معمر' },
        category: 'carbohydrates',
        description: { en: 'A savory rice casserole baked with milk, cream, and butter.', ar: 'طاجن أرز مالح مخبوز بالحليب والقشطة والزبدة.' },
        nutrition: { calories: 300, protein: 7, carbs: 35, fat: 15 },
        details: {
            benefits: { en: 'A rich source of energy and calcium.', ar: 'مصدر غني بالطاقة والكالسيوم.' },
            recommendation: { en: 'A very rich and creamy dish, often containing chicken or meat. Best for special occasions.', ar: 'طبق غني جدًا وكريمي، غالبًا ما يحتوي على دجاج أو لحم. الأفضل للمناسبات الخاصة.' },
            allergens: { en: 'Dairy.', ar: 'ألبان.' }
        }
    },
    {
        id: 37,
        name: { en: 'Zalabya (Luqmat Al Qadi)', ar: 'زلابية (لقمة القاضي)' },
        category: 'snacks',
        description: { en: 'Small, deep-fried dough balls soaked in syrup or dusted with sugar.', ar: 'كرات عجين صغيرة مقلية ومغموسة في شراب أو مرشوشة بالسكر.' },
        nutrition: { calories: 250, protein: 3, carbs: 40, fat: 8 },
        details: {
            benefits: { en: 'A quick source of energy.', ar: 'مصدر سريع للطاقة.' },
            recommendation: { en: 'A popular street food dessert. High in sugar and fat.', ar: 'حلوى طعام شارع شهيرة. عالية في السكر والدهون.' },
            allergens: { en: 'Gluten.', ar: 'الغلوتين.' }
        }
    },
    {
        id: 38,
        name: { en: 'Atayef', ar: 'قطايف' },
        category: 'snacks',
        description: { en: 'Small pancakes stuffed with nuts or cheese, then fried and soaked in syrup.', ar: 'فطائر صغيرة محشوة بالمكسرات أو الجبن، ثم تقلى وتغمس في الشراب.' },
        nutrition: { calories: 350, protein: 7, carbs: 45, fat: 16 },
        details: {
            benefits: { en: 'A rich and festive dessert.', ar: 'حلوى غنية واحتفالية.' },
            recommendation: { en: 'A Ramadan specialty. Can be baked instead of fried for a healthier option.', ar: 'من تخصصات رمضان. يمكن خبزها بدلاً من القلي كخيار صحي أكثر.' },
            allergens: { en: 'Gluten, Dairy (cheese), Nuts.', ar: 'الغلوتين، الألبان (الجبن)، المكسرات.' }
        }
    },
    {
        id: 39,
        name: { en: 'Kahk', ar: 'كحك' },
        category: 'snacks',
        description: { en: 'Buttery cookies, often stuffed with nuts or dates, and dusted with powdered sugar.', ar: 'كعك بالزبدة، غالبًا ما يكون محشوًا بالمكسرات أو التمر، ومرشوشًا بالسكر البودرة.' },
        nutrition: { calories: 150, protein: 2, carbs: 15, fat: 9 },
        details: {
            benefits: { en: 'A traditional holiday treat.', ar: 'حلوى تقليدية للعيد.' },
            recommendation: { en: 'Made especially for Eid al-Fitr. Very high in butter and sugar.', ar: 'يصنع خصيصًا لعيد الفطر. عالي جدًا في الزبدة والسكر.' },
            allergens: { en: 'Gluten, Dairy. May contain nuts.', ar: 'الغلوتين، الألبان. قد تحتوي على مكسرات.' }
        }
    },
    {
        id: 40,
        name: { en: 'Goulash', ar: 'جلاش' },
        category: 'snacks',
        description: { en: 'Layers of phyllo dough with a sweet (nuts) or savory (meat) filling.', ar: 'طبقات من عجينة الفيلو مع حشوة حلوة (مكسرات) أو مالحة (لحم).' },
        nutrition: { calories: 320, protein: 10, carbs: 28, fat: 18 },
        details: {
            benefits: { en: 'A versatile dish that can be a main course or dessert.', ar: 'طبق متعدد الاستخدامات يمكن أن يكون طبقًا رئيسيًا أو حلوى.' },
            recommendation: { en: 'The savory version is a popular dish on special occasions.', ar: 'النسخة المالحة هي طبق شعبي في المناسبات الخاصة.' },
            allergens: { en: 'Gluten, Dairy. May contain nuts.', ar: 'الغلوتين، الألبان. قد تحتوي على مكسرات.' }
        }
    },
    {
        id: 41,
        name: { en: 'Sogo\' Eskandarani', ar: 'سجق إسكندراني' },
        category: 'proteins',
        description: { en: 'Spicy Egyptian beef sausage, pan-fried with peppers and tomatoes.', ar: 'سجق بقري مصري حار، مقلي مع الفلفل والطماطم.' },
        nutrition: { calories: 350, protein: 15, carbs: 5, fat: 30 },
        details: {
            benefits: { en: 'A flavorful source of protein.', ar: 'مصدر لذيذ للبروتين.' },
            recommendation: { en: 'Often served in sandwiches. Very high in fat.', ar: 'غالبًا ما يقدم في السندويشات. عالي جدًا في الدهون.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 42,
        name: { en: 'Betengan Mekhalel', ar: 'باذنجان مخلل' },
        category: 'vegetables',
        description: { en: 'Fried or boiled eggplant stuffed with a garlic, chili, and herb mixture.', ar: 'باذنجان مقلي أو مسلوق محشو بخليط الثوم والفلفل الحار والأعشاب.' },
        nutrition: { calories: 100, protein: 2, carbs: 8, fat: 7 },
        details: {
            benefits: { en: 'A flavorful side dish that complements many meals.', ar: 'طبق جانبي لذيذ يكمل العديد من الوجبات.' },
            recommendation: { en: 'Boiling the eggplant is a much healthier alternative to frying.', ar: 'سلق الباذنجان هو بديل صحي أكثر بكثير من القلي.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 43,
        name: { en: 'Samak Mashwy (Grilled Fish)', ar: 'سمك مشوي' },
        category: 'proteins',
        description: { en: 'Whole grilled fish, typically tilapia or sea bass, seasoned with herbs.', ar: 'سمك مشوي كامل، عادة بلطي أو قاروص، متبل بالأعشاب.' },
        nutrition: { calories: 180, protein: 25, carbs: 2, fat: 8 },
        details: {
            benefits: { en: 'An excellent source of lean protein and omega-3s.', ar: 'مصدر ممتاز للبروتين قليل الدهن وأوميغا 3.' },
            recommendation: { en: 'A very healthy meal choice, often served with rice and salads.', ar: 'خيار وجبة صحي جدًا، غالبًا ما يقدم مع الأرز والسلطات.' },
            allergens: { en: 'Fish.', ar: 'سمك.' }
        }
    },
    {
        id: 44,
        name: { en: 'Gambari (Shrimp)', ar: 'جمبري' },
        category: 'proteins',
        description: { en: 'Shrimp cooked in various ways, such as grilled, fried, or in a tomato stew.', ar: 'جمبري مطبوخ بطرق مختلفة، مثل المشوي أو المقلي أو في يخنة طماطم.' },
        nutrition: { calories: 150, protein: 24, carbs: 1, fat: 4 },
        details: {
            benefits: { en: 'Low in calories and a great source of protein and selenium.', ar: 'قليل السعرات الحرارية ومصدر رائع للبروتين والسيلينيوم.' },
            recommendation: { en: 'Grilling or sautéing are the healthiest cooking methods.', ar: 'الشوي أو التشويح هما أصح طرق الطهي.' },
            allergens: { en: 'Shellfish.', ar: 'المحار.' }
        }
    },
    {
        id: 45,
        name: { en: 'A\'sal w Teheena', ar: 'عسل وطحينة' },
        category: 'snacks',
        description: { en: 'A simple, sweet dip made by mixing blackstrap molasses with tahini.', ar: 'غموس حلو وبسيط مصنوع من خلط العسل الأسود مع الطحينة.' },
        nutrition: { calories: 130, protein: 3, carbs: 15, fat: 7 },
        details: {
            benefits: { en: 'Molasses is a good source of iron, and tahini provides calcium and healthy fats.', ar: 'العسل الأسود مصدر جيد للحديد، والطحينة توفر الكالسيوم والدهون الصحية.' },
            recommendation: { en: 'A traditional breakfast item or snack, eaten with bread.', ar: 'عنصر إفطار تقليدي أو وجبة خفيفة، تؤكل مع الخبز.' },
            allergens: { en: 'Sesame.', ar: 'السمسم.' }
        }
    },
    {
        id: 46,
        name: { en: 'Halawa', ar: 'حلاوة' },
        category: 'snacks',
        description: { en: 'A dense, sweet confection made from tahini (sesame paste).', ar: 'حلوى كثيفة وحلوة مصنوعة من الطحينة (معجون السمسم).' },
        nutrition: { calories: 500, protein: 12, carbs: 50, fat: 28 },
        details: {
            benefits: { en: 'A concentrated source of energy, calcium, and iron.', ar: 'مصدر مركز للطاقة والكالسيوم والحديد.' },
            recommendation: { en: 'Very high in sugar and fat, so it should be eaten in small amounts.', ar: 'عالية جدًا في السكر والدهون، لذا يجب تناولها بكميات صغيرة.' },
            allergens: { en: 'Sesame. Often contains nuts.', ar: 'السمسم. غالبًا ما تحتوي على مكسرات.' }
        }
    },
    {
        id: 47,
        name: { en: 'Kishk', ar: 'كشك' },
        category: 'proteins',
        description: { en: 'A creamy, savory pudding made from fermented yogurt and flour.', ar: 'بودنغ مالح وكريمي مصنوع من الزبادي المخمر والدقيق.' },
        nutrition: { calories: 180, protein: 10, carbs: 15, fat: 8 },
        details: {
            benefits: { en: 'Contains probiotics from the fermented yogurt, aiding digestion.', ar: 'يحتوي على بروبيوتيك من الزبادي المخمر، مما يساعد على الهضم.' },
            recommendation: { en: 'A traditional dish from rural Egypt, often topped with fried onions.', ar: 'طبق تقليدي من ريف مصر، غالبًا ما يغطى بالبصل المقلي.' },
            allergens: { en: 'Gluten, Dairy.', ar: 'الغلوتين، الألبان.' }
        }
    },
    {
        id: 48,
        name: { en: 'Sakalans', ar: 'سكلانس' },
        category: 'snacks',
        description: { en: 'A sweet sandwich with halawa, cream (eshta), and honey or jam.', ar: 'شطيرة حلوة تحتوي على حلاوة وقشطة وعسل أو مربى.' },
        nutrition: { calories: 450, protein: 8, carbs: 60, fat: 20 },
        details: {
            benefits: { en: 'Provides a massive and immediate energy boost.', ar: 'يوفر دفعة طاقة هائلة وفورية.' },
            recommendation: { en: 'An extremely sweet and high-calorie treat. Enjoy very sparingly.', ar: 'حلوى حلوة جدًا وعالية السعرات الحرارية. استمتع بها باعتدال شديد.' },
            allergens: { en: 'Gluten, Dairy, Sesame.', ar: 'الغلوتين، الألبان، السمسم.' }
        }
    },
    {
        id: 49,
        name: { en: 'Fattoush Salad', ar: 'سلطة فتوش' },
        category: 'vegetables',
        description: { en: 'A refreshing salad with mixed greens, vegetables, and toasted pita bread.', ar: 'سلطة منعشة مع خضروات مشكلة وخبز محمص.' },
        nutrition: { calories: 120, protein: 3, carbs: 15, fat: 6 },
        details: {
            benefits: { en: 'A low-calorie dish packed with vitamins and fiber.', ar: 'طبق قليل السعرات الحرارية ومليء بالفيتامينات والألياف.' },
            recommendation: { en: 'The lemon-sumac dressing is key. A great way to start a meal.', ar: 'صلصة الليمون والسماق هي المفتاح. طريقة رائعة لبدء وجبة.' },
            allergens: { en: 'Gluten (bread).', ar: 'الغلوتين (الخبز).' }
        }
    },
    {
        id: 50,
        name: { en: 'Egyptian Coffee (Ahwa)', ar: 'قهوة' },
        category: 'beverages',
        description: { en: 'Strong, unfiltered coffee brewed in a small pot called a kanaka.', ar: 'قهوة قوية وغير مصفاة تحضر في وعاء صغير يسمى كنكة.' },
        nutrition: { calories: 5, protein: 0, carbs: 1, fat: 0 },
        details: {
            benefits: { en: 'Rich in antioxidants and provides a caffeine boost for alertness.', ar: 'غنية بمضادات الأكسدة وتوفر دفعة من الكافيين لليقظة.' },
            recommendation: { en: 'Can be made sweet (mazboot) or unsweetened (sada). The foam (wesh) on top is highly prized.', ar: 'يمكن أن تكون حلوة (مظبوط) أو غير محلاة (سادة). الرغوة (الوش) على السطح ذات قيمة عالية.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 51,
        name: { en: 'Tarb', ar: 'طرب' },
        category: 'proteins',
        description: { en: 'Grilled kofta wrapped in lamb fat, a rich and flavorful delicacy.', ar: 'كفتة مشوية ملفوفة في دهن الخروف، طبق غني ولذيذ.' },
        nutrition: { calories: 400, protein: 18, carbs: 2, fat: 35 },
        details: {
            benefits: { en: 'High in protein and provides a significant amount of energy from fat.', ar: 'غني بالبروتين ويوفر كمية كبيرة من الطاقة من الدهون.' },
            recommendation: { en: 'A very rich dish, best enjoyed in moderation as part of a larger meal.', ar: 'طبق دسم جدًا، يفضل تناوله باعتدال كجزء من وجبة أكبر.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 52,
        name: { en: 'Salata Baladi', ar: 'سلطة بلدي' },
        category: 'vegetables',
        description: { en: 'A simple, refreshing chopped salad with cucumber, tomato, onion, and parsley.', ar: 'سلطة مقطعة بسيطة ومنعشة مع الخيار والطماطم والبصل والبقدونس.' },
        nutrition: { calories: 40, protein: 1, carbs: 8, fat: 0.5 },
        details: {
            benefits: { en: 'Hydrating and rich in vitamins and minerals. Low in calories.', ar: 'مرطبة وغنية بالفيتامينات والمعادن. قليلة السعرات الحرارية.' },
            recommendation: { en: 'A staple side dish for almost any Egyptian meal, especially grilled foods.', ar: 'طبق جانبي أساسي لكل وجبة مصرية تقريبًا، خاصة مع المشويات.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 53,
        name: { en: 'Freekeh', ar: 'فريك' },
        category: 'carbohydrates',
        description: { en: 'Young, green wheat that has been roasted and rubbed. Has a smoky flavor.', ar: 'قمح أخضر شاب يتم تحميصه وفركه. له نكهة مدخنة.' },
        nutrition: { calories: 170, protein: 6, carbs: 34, fat: 1.5 },
        details: {
            benefits: { en: 'High in fiber and protein compared to other grains. Good source of minerals.', ar: 'غني بالألياف والبروتين مقارنة بالحبوب الأخرى. مصدر جيد للمعادن.' },
            recommendation: { en: 'Often used to stuff pigeons (Hamam Mahshi) or as a pilaf.', ar: 'يستخدم غالبًا لحشو الحمام (حمام محشي) أو كبيلاف.' },
            allergens: { en: 'Gluten.', ar: 'الغلوتين.' }
        }
    },
    {
        id: 54,
        name: { en: 'Potato Casserole', ar: 'صينية بطاطس' },
        category: 'vegetables',
        description: { en: 'A classic comfort dish of sliced potatoes, tomatoes, and onions baked with chicken or meat.', ar: 'طبق كلاسيكي مريح من شرائح البطاطس والطماطم والبصل المخبوزة مع الدجاج أو اللحم.' },
        nutrition: { calories: 220, protein: 15, carbs: 20, fat: 9 },
        details: {
            benefits: { en: 'A complete meal combining carbs, protein, and vegetables.', ar: 'وجبة كاملة تجمع بين الكربوهيدرات والبروتين والخضروات.' },
            recommendation: { en: 'A staple in Egyptian homes, perfect for family gatherings.', ar: 'طبق أساسي في المنازل المصرية، مثالي للتجمعات العائلية.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 55,
        name: { en: 'Fried Brain (Mokh Banee)', ar: 'مخ بانيه' },
        category: 'proteins',
        description: { en: 'Calf or lamb brains, boiled then breaded and fried until golden.', ar: 'مخ العجل أو الخروف، يُسلق ثم يُغطى بالبقسماط ويُقلى حتى يصبح ذهبيًا.' },
        nutrition: { calories: 250, protein: 12, carbs: 10, fat: 18 },
        details: {
            benefits: { en: 'Rich in omega-3 fatty acids and certain B vitamins.', ar: 'غني بأحماض أوميغا 3 الدهنية وبعض فيتامينات ب.' },
            recommendation: { en: 'A delicacy for adventurous eaters. High in cholesterol.', ar: 'طعام شهي للآكلين المغامرين. عالي الكوليسترول.' },
            allergens: { en: 'Gluten (breading).', ar: 'الغلوتين (البقسماط).' }
        }
    },
    {
        id: 56,
        name: { en: 'Rokak with Meat', ar: 'رقاق باللحمة' },
        category: 'proteins',
        description: { en: 'Thin, crisp layers of dough filled with seasoned minced meat and baked.', ar: 'طبقات رقيقة ومقرمشة من العجين محشوة باللحم المفروم المتبل ومخبوزة.' },
        nutrition: { calories: 350, protein: 15, carbs: 30, fat: 18 },
        details: {
            benefits: { en: 'A festive dish providing protein and carbohydrates.', ar: 'طبق احتفالي يوفر البروتين والكربوهيدرات.' },
            recommendation: { en: 'Similar to Goulash but made with a different type of pastry. Often served during Eid.', ar: 'يشبه الجلاش ولكنه مصنوع من نوع مختلف من العجين. يقدم غالبًا في العيد.' },
            allergens: { en: 'Gluten, Dairy.', ar: 'الغلوتين، الألبان.' }
        }
    },
    {
        id: 57,
        name: { en: 'Gebna Qadima (Mish)', ar: 'جبنة قديمة (مش)' },
        category: 'dairy',
        description: { en: 'A traditional cheese aged in brine for several months, with a very sharp, salty taste.', ar: 'جبنة تقليدية معتقة في محلول ملحي لعدة أشهر، ذات طعم حاد ومالح جدًا.' },
        nutrition: { calories: 100, protein: 7, carbs: 1, fat: 8 },
        details: {
            benefits: { en: 'Contains probiotics from the fermentation process.', ar: 'تحتوي على بروبيوتيك من عملية التخمير.' },
            recommendation: { en: 'An acquired taste. Often eaten with tomatoes, onions, and oil to balance its intensity.', ar: 'ذوق مكتسب. تؤكل غالبًا مع الطماطم والبصل والزيت لموازنة حدتها.' },
            allergens: { en: 'Dairy.', ar: 'ألبان.' }
        }
    },
    {
        id: 58,
        name: { en: 'Ghorayeba', ar: 'غريبة' },
        category: 'snacks',
        description: { en: 'Delicate, buttery shortbread cookies that melt in your mouth.', ar: 'كوكيز زبدية هشة ورقيقة تذوب في الفم.' },
        nutrition: { calories: 80, protein: 1, carbs: 8, fat: 5 },
        details: {
            benefits: { en: 'A simple, classic dessert.', ar: 'حلوى بسيطة وكلاسيكية.' },
            recommendation: { en: 'Another popular treat for Eid al-Fitr, alongside Kahk.', ar: 'حلوى أخرى شهيرة لعيد الفطر، بجانب الكحك.' },
            allergens: { en: 'Gluten, Dairy. May contain nuts.', ar: 'الغلوتين، الألبان. قد تحتوي على مكسرات.' }
        }
    },
    {
        id: 59,
        name: { en: 'Balah El Sham', ar: 'بلح الشام' },
        category: 'snacks',
        description: { en: 'Deep-fried choux pastry fingers soaked in sweet syrup.', ar: 'أصابع من عجينة الشو المقلية والمغموسة في شراب حلو.' },
        nutrition: { calories: 280, protein: 3, carbs: 40, fat: 12 },
        details: {
            benefits: { en: 'A crunchy and sweet dessert providing quick energy.', ar: 'حلوى مقرمشة وحلوة توفر طاقة سريعة.' },
            recommendation: { en: 'Similar to churros or tulumba. Very high in sugar.', ar: 'تشبه التشوروز أو التولومبا. عالية جدًا في السكر.' },
            allergens: { en: 'Gluten, Eggs.', ar: 'الغلوتين، البيض.' }
        }
    },
    {
        id: 60,
        name: { en: 'Rice with Vermicelli', ar: 'أرز بالشعرية' },
        category: 'carbohydrates',
        description: { en: 'The most common way to prepare rice in Egypt, with toasted vermicelli noodles.', ar: 'الطريقة الأكثر شيوعًا لتحضير الأرز في مصر، مع الشعيرية المحمصة.' },
        nutrition: { calories: 200, protein: 4, carbs: 42, fat: 1 },
        details: {
            benefits: { en: 'A staple source of carbohydrates for energy.', ar: 'مصدر أساسي للكربوهيدرات للطاقة.' },
            recommendation: { en: 'Served as the base for almost all stews and main dishes.', ar: 'يقدم كقاعدة لجميع اليخنات والأطباق الرئيسية تقريبًا.' },
            allergens: { en: 'Gluten (vermicelli).', ar: 'الغلوتين (الشعيرية).' }
        }
    },
    {
        id: 61,
        name: { en: 'Fried Eggs with Pastrami', ar: 'بيض بالبسطرمة' },
        category: 'proteins',
        description: { en: 'A popular and flavorful breakfast dish of eggs fried with slices of spicy cured beef (pastirma).', ar: 'طبق إفطار شهير ولذيذ من البيض المقلي مع شرائح البسطرمة (لحم بقري مجفف ومتبل).' },
        nutrition: { calories: 250, protein: 18, carbs: 1, fat: 20 },
        details: {
            benefits: { en: 'A great source of high-quality protein to start the day.', ar: 'مصدر رائع للبروتين عالي الجودة لبدء اليوم.' },
            recommendation: { en: 'Pastrami is high in sodium, so enjoy in moderation.', ar: 'البسطرمة عالية الصوديوم، لذا استمتع بها باعتدال.' },
            allergens: { en: 'Eggs.', ar: 'بيض.' }
        }
    },
    {
        id: 62,
        name: { en: 'Fava Bean Sprouts Soup', ar: 'شوربة فول نابت' },
        category: 'proteins',
        description: { en: 'A light and nutritious soup made from sprouted fava beans.', ar: 'شوربة خفيفة ومغذية مصنوعة من براعم الفول.' },
        nutrition: { calories: 90, protein: 7, carbs: 14, fat: 1 },
        details: {
            benefits: { en: 'Sprouting increases the nutritional value of the beans. Easy to digest.', ar: 'التبرعم يزيد من القيمة الغذائية للفول. سهل الهضم.' },
            recommendation: { en: 'Often recommended as a restorative food when feeling sick.', ar: 'غالبًا ما يوصى به كطعام علاجي عند الشعور بالمرض.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 63,
        name: { en: 'Lupini Beans (Termis)', ar: 'ترمس' },
        category: 'snacks',
        description: { en: 'Boiled lupini beans, a popular savory snack often sold by street vendors.', ar: 'حبوب الترمس المسلوقة، وجبة خفيفة مالحة شهيرة تباع غالبًا من قبل الباعة الجائلين.' },
        nutrition: { calories: 119, protein: 10, carbs: 12, fat: 3 },
        details: {
            benefits: { en: 'Extremely high in fiber and a good source of plant-based protein.', ar: 'غني جدًا بالألياف ومصدر جيد للبروتين النباتي.' },
            recommendation: { en: 'A healthy and filling snack, especially during holidays and gatherings.', ar: 'وجبة خفيفة صحية ومشبعة، خاصة خلال الأعياد والتجمعات.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 64,
        name: { en: 'Hummus Sham (Halabesa)', ar: 'حمص الشام (حلبسة)' },
        category: 'beverages',
        description: { en: 'A spicy chickpea drink, served hot. A popular winter street food.', ar: 'مشروب حمص حار، يقدم ساخنًا. طعام شارع شتوي شهير.' },
        nutrition: { calories: 130, protein: 6, carbs: 22, fat: 2 },
        details: {
            benefits: { en: 'Warming, comforting, and a good source of fiber and protein.', ar: 'مدفئ ومريح ومصدر جيد للألياف والبروتين.' },
            recommendation: { en: 'Enjoyed on cold nights, especially along the Nile corniche.', ar: 'يتم الاستمتاع به في الليالي الباردة، خاصة على كورنيش النيل.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 65,
        name: { en: 'Karkadeh (Hibiscus Tea)', ar: 'كركديه' },
        category: 'beverages',
        description: { en: 'A tart, cranberry-like tea made from hibiscus flowers. Can be served hot or cold.', ar: 'شاي لاذع يشبه التوت البري مصنوع من زهور الكركديه. يمكن تقديمه ساخنًا أو باردًا.' },
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        details: {
            benefits: { en: 'Rich in antioxidants and may help lower blood pressure.', ar: 'غني بمضادات الأكسدة وقد يساعد في خفض ضغط الدم.' },
            recommendation: { en: 'A very popular and refreshing drink, especially during Ramadan.', ar: 'مشروب شهير ومنعش للغاية، خاصة خلال شهر رمضان.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 66,
        name: { en: 'Sahlab', ar: 'سحلب' },
        category: 'beverages',
        description: { en: 'A sweet, hot, milky pudding-like drink, popular in winter.', ar: 'مشروب حلو وساخن وحليبي يشبه البودنغ، شهير في الشتاء.' },
        nutrition: { calories: 180, protein: 5, carbs: 30, fat: 4 },
        details: {
            benefits: { en: 'A warming and comforting drink.', ar: 'مشروب مدفئ ومريح.' },
            recommendation: { en: 'Often garnished with cinnamon, nuts, and raisins.', ar: 'غالبًا ما يزين بالقرفة والمكسرات والزبيب.' },
            allergens: { en: 'Dairy, Nuts.', ar: 'ألبان، مكسرات.' }
        }
    },
    {
        id: 67,
        name: { en: 'Tamarind Juice (Tamr Hindi)', ar: 'تمر هندي' },
        category: 'beverages',
        description: { en: 'A sweet and sour drink made from the tamarind fruit.', ar: 'مشروب حلو وحامض مصنوع من فاكهة التمر الهندي.' },
        nutrition: { calories: 100, protein: 0, carbs: 25, fat: 0 },
        details: {
            benefits: { en: 'Believed to have digestive benefits.', ar: 'يعتقد أن له فوائد هضمية.' },
            recommendation: { en: 'A very common drink to break the fast during Ramadan.', ar: 'مشروب شائع جدًا لكسر الصيام خلال شهر رمضان.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 68,
        name: { en: 'Qamar al-Din Juice', ar: 'قمر الدين' },
        category: 'beverages',
        description: { en: 'A thick, sweet drink made from dried apricot paste.', ar: 'مشروب كثيف وحلو مصنوع من معجون المشمش المجفف.' },
        nutrition: { calories: 120, protein: 1, carbs: 30, fat: 0 },
        details: {
            benefits: { en: 'Good source of Vitamin A and provides a quick energy boost.', ar: 'مصدر جيد لفيتامين أ ويوفر دفعة سريعة من الطاقة.' },
            recommendation: { en: 'The quintessential Ramadan drink in Egypt and the Levant.', ar: 'المشروب الرمضاني النموذجي في مصر والشام.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 69,
        name: { en: 'Sugarcane Juice (Asab)', ar: 'عصير قصب' },
        category: 'beverages',
        description: { en: 'The sweet, fresh-pressed juice of sugarcane stalks.', ar: 'العصير الحلو والطازج المعصور من سيقان قصب السكر.' },
        nutrition: { calories: 180, protein: 0, carbs: 45, fat: 0 },
        details: {
            benefits: { en: 'Provides an instant rush of energy due to its high natural sugar content.', ar: 'يوفر دفعة فورية من الطاقة بسبب محتواه العالي من السكر الطبيعي.' },
            recommendation: { en: 'An incredibly popular and cheap thirst-quencher found at juice stands everywhere.', ar: 'مروي عطش شهير ورخيص للغاية يوجد في أكشاك العصير في كل مكان.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 70,
        name: { en: 'Sobia', ar: 'سوبيا' },
        category: 'beverages',
        description: { en: 'A creamy, sweet drink made from rice, coconut, and milk.', ar: 'مشروب كريمي وحلو مصنوع من الأرز وجوز الهند والحليب.' },
        nutrition: { calories: 200, protein: 4, carbs: 35, fat: 5 },
        details: {
            benefits: { en: 'A refreshing and filling drink.', ar: 'مشروب منعش ومشبع.' },
            recommendation: { en: 'Another popular beverage during Ramadan, sold in large bags by street vendors.', ar: 'مشروب شهير آخر خلال شهر رمضان، يباع في أكياس كبيرة من قبل الباعة الجائلين.' },
            allergens: { en: 'Dairy, Coconut.', ar: 'ألبان، جوز الهند.' }
        }
    },
    {
        id: 71,
        name: { en: 'Carob Juice (Kharoub)', ar: 'خروب' },
        category: 'beverages',
        description: { en: 'A healthy, naturally sweet drink made from carob pods, with a chocolate-like flavor.', ar: 'مشروب صحي وحلو بشكل طبيعي مصنوع من قرون الخروب، بنكهة تشبه الشوكولاتة.' },
        nutrition: { calories: 90, protein: 0, carbs: 22, fat: 0 },
        details: {
            benefits: { en: 'Rich in antioxidants and fiber, and a good source of calcium.', ar: 'غني بمضادات الأكسدة والألياف، ومصدر جيد للكالسيوم.' },
            recommendation: { en: 'A traditional Ramadan drink known for its nutritional value.', ar: 'مشروب رمضاني تقليدي معروف بقيمته الغذائية.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 72,
        name: { en: 'Mint Tea (Shai bil Nana)', ar: 'شاي بالنعناع' },
        category: 'beverages',
        description: { en: 'Black tea brewed with fresh mint leaves, a staple of Egyptian hospitality.', ar: 'شاي أسود محضر بأوراق النعناع الطازجة، عنصر أساسي في الضيافة المصرية.' },
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        details: {
            benefits: { en: 'Aids digestion and has a calming effect.', ar: 'يساعد على الهضم وله تأثير مهدئ.' },
            recommendation: { en: 'Served extremely sweet in small glasses after meals or during social visits.', ar: 'يقدم حلوًا للغاية في أكواب صغيرة بعد الوجبات أو أثناء الزيارات الاجتماعية.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 73,
        name: { en: 'Salted Fish (Mlouha)', ar: 'ملوحة' },
        category: 'proteins',
        description: { en: 'A type of salted fish, even more pungent than Fesikh, popular in Upper Egypt.', ar: 'نوع من الأسماك المملحة، أكثر نفاذية من الفسيخ، شهير في صعيد مصر.' },
        nutrition: { calories: 220, protein: 25, carbs: 0, fat: 15 },
        details: {
            benefits: { en: 'Very high in protein and sodium.', ar: 'غني جدًا بالبروتين والصوديوم.' },
            recommendation: { en: 'Like Fesikh, it requires careful preparation to be safe for consumption.', ar: 'مثل الفسيخ، يتطلب تحضيرًا دقيقًا ليكون آمنًا للاستهلاك.' },
            allergens: { en: 'Fish.', ar: 'سمك.' }
        }
    },
    {
        id: 74,
        name: { en: 'Fried Fish (Samak Ma\'li)', ar: 'سمك مقلي' },
        category: 'proteins',
        description: { en: 'Whole fish or fillets coated in seasoned flour and deep-fried until crispy.', ar: 'سمك كامل أو شرائح مغطاة بالدقيق المتبل ومقلية حتى تصبح مقرمشة.' },
        nutrition: { calories: 280, protein: 20, carbs: 10, fat: 18 },
        details: {
            benefits: { en: 'A delicious way to consume fish protein.', ar: 'طريقة لذيذة لاستهلاك بروتين السمك.' },
            recommendation: { en: 'Grilling (Mashwy) is a healthier option due to the high fat from frying.', ar: 'الشوي (مشوي) هو خيار صحي أكثر بسبب الدهون العالية من القلي.' },
            allergens: { en: 'Fish, Gluten.', ar: 'سمك، جلوتين.' }
        }
    },
    {
        id: 75,
        name: { en: 'Calamari', ar: 'كاليماري' },
        category: 'proteins',
        description: { en: 'Squid rings, often coated in batter and deep-fried.', ar: 'حلقات الحبار، غالبًا ما تكون مغطاة بالعجين ومقلية.' },
        nutrition: { calories: 250, protein: 18, carbs: 15, fat: 12 },
        details: {
            benefits: { en: 'A good source of protein, zinc, and selenium.', ar: 'مصدر جيد للبروتين والزنك والسيلينيوم.' },
            recommendation: { en: 'Popular in coastal cities. Grilling or sautéing is a healthier preparation method.', ar: 'شهير في المدن الساحلية. الشوي أو التشويح طريقة تحضير صحية أكثر.' },
            allergens: { en: 'Shellfish, Gluten.', ar: 'المحار، الجلوتين.' }
        }
    },
    {
        id: 76,
        name: { en: 'Areesh Cheese', ar: 'جبنة قريش' },
        category: 'dairy',
        description: { en: 'A fresh, soft, white cheese similar to cottage cheese, made from skimmed milk.', ar: 'جبنة بيضاء طازجة وطرية تشبه جبن القريش، مصنوعة من الحليب منزوع الدسم.' },
        nutrition: { calories: 72, protein: 14, carbs: 3, fat: 1 },
        details: {
            benefits: { en: 'Excellent source of lean protein and calcium, very low in fat.', ar: 'مصدر ممتاز للبروتين قليل الدهن والكالسيوم، قليل جدًا في الدهون.' },
            recommendation: { en: 'A very healthy option, often eaten with tomatoes, cucumbers, and olive oil.', ar: 'خيار صحي جدًا، يؤكل غالبًا مع الطماطم والخيار وزيت الزيتون.' },
            allergens: { en: 'Dairy.', ar: 'ألبان.' }
        }
    },
    {
        id: 77,
        name: { en: 'Stuffed Cabbage', ar: 'محشي كرنب' },
        category: 'vegetables',
        description: { en: 'Cabbage leaves stuffed with a seasoned rice mixture and cooked in a tomato broth.', ar: 'أوراق الكرنب المحشوة بخليط الأرز المتبل والمطبوخة في مرق الطماطم.' },
        nutrition: { calories: 140, protein: 3, carbs: 25, fat: 4 },
        details: {
            benefits: { en: 'Cabbage is rich in Vitamin C and K.', ar: 'الكرنب غني بفيتامين ج و ك.' },
            recommendation: { en: 'A classic and beloved Egyptian comfort food, especially in winter.', ar: 'طعام مصري كلاسيكي ومحبوب، خاصة في الشتاء.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 78,
        name: { en: 'Stuffed Grape Leaves', ar: 'محشي ورق عنب' },
        category: 'vegetables',
        description: { en: 'Grape leaves filled with a rice, herb, and sometimes meat mixture.', ar: 'أوراق العنب المحشوة بخليط من الأرز والأعشاب وأحيانًا اللحم.' },
        nutrition: { calories: 160, protein: 4, carbs: 22, fat: 7 },
        details: {
            benefits: { en: 'Grape leaves are a good source of vitamins and minerals.', ar: 'أوراق العنب مصدر جيد للفيتامينات والمعادن.' },
            recommendation: { en: 'Often served as an appetizer (mezze). Best served with a squeeze of lemon.', ar: 'غالبًا ما تقدم كمقبلات (مزة). يفضل تقديمها مع عصرة ليمون.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 79,
        name: { en: 'Petit Four', ar: 'بيتيفور' },
        category: 'snacks',
        description: { en: 'Small, buttery cookies, often decorated or sandwiched with jam or chocolate.', ar: 'كوكيز صغيرة بالزبدة، غالبًا ما تكون مزينة أو محشوة بالمربى أو الشوكولاتة.' },
        nutrition: { calories: 60, protein: 1, carbs: 7, fat: 3 },
        details: {
            benefits: { en: 'A small, elegant treat.', ar: 'حلوى صغيرة وأنيقة.' },
            recommendation: { en: 'Like Kahk and Ghorayeba, these are very popular during Eid celebrations.', ar: 'مثل الكحك والغريبة، تحظى بشعبية كبيرة خلال احتفالات العيد.' },
            allergens: { en: 'Gluten, Dairy, Eggs.', ar: 'الغلوتين، الألبان، البيض.' }
        }
    },
    {
        id: 80,
        name: { en: 'Anise Tea (Yansoon)', ar: 'ينسون' },
        category: 'beverages',
        description: { en: 'A herbal tea made from aniseeds, with a sweet, licorice-like flavor.', ar: 'شاي عشبي مصنوع من بذور اليانسون، بنكهة حلوة تشبه عرق السوس.' },
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        details: {
            benefits: { en: 'Commonly used as a digestive aid and to relieve cold symptoms.', ar: 'يستخدم بشكل شائع كمساعد على الهضم ولتخفيف أعراض البرد.' },
            recommendation: { en: 'A popular and comforting caffeine-free hot beverage.', ar: 'مشروب ساخن شهير ومريح خالٍ من الكافيين.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 81,
        name: { en: 'Fenugreek Tea (Helba)', ar: 'حلبة' },
        category: 'beverages',
        description: { en: 'A traditional hot drink made from fenugreek seeds, with a slightly bitter, maple-like taste.', ar: 'مشروب ساخن تقليدي مصنوع من بذور الحلبة، بطعم مر قليلاً يشبه القيقب.' },
        nutrition: { calories: 5, protein: 0, carbs: 1, fat: 0 },
        details: {
            benefits: { en: 'Believed to have numerous health benefits, including aiding digestion and lactation.', ar: 'يعتقد أن لها فوائد صحية عديدة، بما في ذلك المساعدة على الهضم والرضاعة.' },
            recommendation: { en: 'Can be made with milk and honey to improve the taste.', ar: 'يمكن تحضيرها بالحليب والعسل لتحسين الطعم.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 82,
        name: { en: 'Doum Juice', ar: 'عصير دوم' },
        category: 'beverages',
        description: { en: 'A traditional drink made from the fruit of the Doum palm tree, with a unique gingerbread-like flavor.', ar: 'مشروب تقليدي مصنوع من فاكهة شجرة نخيل الدوم، بنكهة فريدة تشبه خبز الزنجبيل.' },
        nutrition: { calories: 80, protein: 0, carbs: 20, fat: 0 },
        details: {
            benefits: { en: 'Believed to help regulate blood pressure.', ar: 'يعتقد أنه يساعد في تنظيم ضغط الدم.' },
            recommendation: { en: 'Another popular thirst-quencher during Ramadan.', ar: 'مروي عطش شهير آخر خلال شهر رمضان.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 83,
        name: { en: 'Bouri Fish', ar: 'سمك بوري' },
        category: 'proteins',
        description: { en: 'Mullet fish, often grilled with a bran coating (Singaari style) or salted to make Fesikh.', ar: 'سمك البوري، غالبًا ما يتم شويه بطبقة من الردة (على طريقة السنجاري) أو تمليحه لصنع الفسيخ.' },
        nutrition: { calories: 150, protein: 22, carbs: 0, fat: 7 },
        details: {
            benefits: { en: 'A good source of protein and healthy fats.', ar: 'مصدر جيد للبروتين والدهون الصحية.' },
            recommendation: { en: 'The Singaari preparation with herbs and vegetables is a healthy and delicious option.', ar: 'تحضير السنجاري بالأعشاب والخضروات هو خيار صحي ولذيذ.' },
            allergens: { en: 'Fish.', ar: 'سمك.' }
        }
    },
    {
        id: 84,
        name: { en: 'Denis Fish', ar: 'سمك دنيس' },
        category: 'proteins',
        description: { en: 'Sea Bream, a popular fish in Egypt prized for its delicate, white flesh.', ar: 'سمك الدنيس، سمكة شهيرة في مصر تقدر لحمها الأبيض الرقيق.' },
        nutrition: { calories: 125, protein: 21, carbs: 0, fat: 4 },
        details: {
            benefits: { en: 'An excellent source of lean protein and low in fat.', ar: 'مصدر ممتاز للبروتين قليل الدهن وقليل الدهون.' },
            recommendation: { en: 'Best enjoyed simply grilled or baked with lemon and oil to appreciate its flavor.', ar: 'يفضل الاستمتاع به مشويًا أو مخبوزًا بالليمون والزيت لتقدير نكهته.' },
            allergens: { en: 'Fish.', ar: 'سمك.' }
        }
    },
    {
        id: 85,
        name: { en: 'Mackerel (Samak Makarel)', ar: 'سمك ماكريل' },
        category: 'proteins',
        description: { en: 'Mackerel, often baked in a tray with potatoes, tomatoes, and peppers.', ar: 'سمك الماكريل، غالبًا ما يتم خبزه في صينية مع البطاطس والطماطم والفلفل.' },
        nutrition: { calories: 262, protein: 24, carbs: 0, fat: 18 },
        details: {
            benefits: { en: 'Extremely high in healthy Omega-3 fatty acids.', ar: 'غني جدًا بأحماض أوميغا 3 الدهنية الصحية.' },
            recommendation: { en: 'A very healthy choice due to its high omega-3 content.', ar: 'خيار صحي للغاية بسبب محتواه العالي من أوميغا 3.' },
            allergens: { en: 'Fish.', ar: 'سمك.' }
        }
    },
    {
        id: 86,
        name: { en: 'Sayadia Rice', ar: 'أرز صيادية' },
        category: 'carbohydrates',
        description: { en: 'Rice cooked with caramelized onions and spices, giving it a brown color and rich flavor.', ar: 'أرز مطبوخ بالبصل المكرمل والتوابل، مما يمنحه لونًا بنيًا ونكهة غنية.' },
        nutrition: { calories: 210, protein: 4, carbs: 45, fat: 1 },
        details: {
            benefits: { en: 'A flavorful carbohydrate base for meals.', ar: 'قاعدة كربوهيدرات لذيذة للوجبات.' },
            recommendation: { en: 'The traditional accompaniment to any seafood meal in coastal cities.', ar: 'المرافق التقليدي لأي وجبة بحرية في المدن الساحلية.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 87,
        name: { en: 'Macaroni with Liver', ar: 'مكرونة بالكبدة' },
        category: 'carbohydrates',
        description: { en: 'A popular street food dish of pasta topped with Alexandrian-style spicy liver.', ar: 'طبق طعام شارع شهير من المكرونة مغطاة بالكبدة الإسكندراني الحارة.' },
        nutrition: { calories: 350, protein: 25, carbs: 40, fat: 10 },
        details: {
            benefits: { en: 'A filling and nutritious meal, rich in iron and protein.', ar: 'وجبة مشبعة ومغذية، غنية بالحديد والبروتين.' },
            recommendation: { en: 'A hearty and affordable meal found in many local eateries.', ar: 'وجبة دسمة وبأسعار معقولة توجد في العديد من المطاعم المحلية.' },
            allergens: { en: 'Gluten.', ar: 'الغلوتين.' }
        }
    },
    {
        id: 88,
        name: { en: 'Macaroni with Sausage', ar: 'مكرونة بالسجق' },
        category: 'carbohydrates',
        description: { en: 'Pasta served with spicy Egyptian sausage (Sogo\') in a tomato sauce.', ar: 'مكرونة تقدم مع السجق المصري الحار في صلصة الطماطم.' },
        nutrition: { calories: 400, protein: 18, carbs: 45, fat: 18 },
        details: {
            benefits: { en: 'A satisfying and flavorful combination of carbs and protein.', ar: 'مزيج مشبع ولذيذ من الكربوهيدرات والبروتين.' },
            recommendation: { en: 'High in fat due to the sausage, so best eaten in moderation.', ar: 'عالية الدهون بسبب السجق، لذا يفضل تناولها باعتدال.' },
            allergens: { en: 'Gluten.', ar: 'الغلوتين.' }
        }
    },
    {
        id: 89,
        name: { en: 'Bread Pudding (Aish Bel Laban)', ar: 'عيش باللبن' },
        category: 'snacks',
        description: { en: 'A simple, comforting dessert made from soaking bread in sweet, warm milk.', ar: 'حلوى بسيطة ومريحة مصنوعة من نقع الخبز في الحليب الحلو والدافئ.' },
        nutrition: { calories: 250, protein: 8, carbs: 40, fat: 6 },
        details: {
            benefits: { en: 'Easy to digest and provides calcium and carbohydrates.', ar: 'سهل الهضم ويوفر الكالسيوم والكربوهيدرات.' },
            recommendation: { en: 'A traditional, homely dessert often made for children or as a quick treat.', ar: 'حلوى تقليدية ومنزلية غالبًا ما تصنع للأطفال أو كحلوى سريعة.' },
            allergens: { en: 'Gluten, Dairy.', ar: 'الغلوتين، الألبان.' }
        }
    },
    {
        id: 90,
        name: { en: 'Chicken Pane', ar: 'فراخ بانيه' },
        category: 'proteins',
        description: { en: 'Thin chicken breast fillets, breaded and fried until golden and crispy.', ar: 'شرائح صدر دجاج رقيقة، مغطاة بالبقسماط ومقلية حتى تصبح ذهبية ومقرمشة.' },
        nutrition: { calories: 300, protein: 25, carbs: 15, fat: 15 },
        details: {
            benefits: { en: 'A popular source of lean protein.', ar: 'مصدر شهير للبروتين قليل الدهن.' },
            recommendation: { en: 'A favorite among children and adults alike. Baking instead of frying is a healthier option.', ar: 'مفضل لدى الأطفال والبالغين على حد سواء. الخبز بدلاً من القلي هو خيار صحي أكثر.' },
            allergens: { en: 'Gluten, Eggs.', ar: 'الغلوتين، البيض.' }
        }
    },
    {
        id: 91,
        name: { en: 'Meatballs in Sauce', ar: 'كرات اللحم بالصلصة' },
        category: 'proteins',
        description: { en: 'Egyptian meatballs (Kofta) cooked in a rich, seasoned tomato sauce.', ar: 'كفتة مصرية مطبوخة في صلصة طماطم غنية ومتبلة.' },
        nutrition: { calories: 320, protein: 20, carbs: 10, fat: 22 },
        details: {
            benefits: { en: 'High in protein and iron.', ar: 'غنية بالبروتين والحديد.' },
            recommendation: { en: 'Often served with rice. Can be made healthier with lean ground beef.', ar: 'غالبًا ما تقدم مع الأرز. يمكن جعلها صحية أكثر باللحم المفروم قليل الدهن.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 92,
        name: { en: 'Couscous (Sweet)', ar: 'كسكسي (حلو)' },
        category: 'snacks',
        description: { en: 'Steamed couscous grains served as a dessert with powdered sugar, butter, and nuts.', ar: 'حبوب الكسكسي المطهوة على البخار تقدم كحلوى مع السكر البودرة والزبدة والمكسرات.' },
        nutrition: { calories: 350, protein: 8, carbs: 60, fat: 8 },
        details: {
            benefits: { en: 'Provides complex carbohydrates for energy.', ar: 'يوفر كربوهيدرات معقدة للطاقة.' },
            recommendation: { en: 'A traditional dessert, especially in rural areas.', ar: 'حلوى تقليدية، خاصة في المناطق الريفية.' },
            allergens: { en: 'Gluten, Dairy, Nuts.', ar: 'الغلوتين، الألبان، المكسرات.' }
        }
    },
    {
        id: 93,
        name: { en: 'Semolina Porridge (Belila)', ar: 'بليلة' },
        category: 'beverages',
        description: { en: 'A warm porridge of whole wheat berries cooked in milk, sweetened, and topped with nuts.', ar: 'عصيدة دافئة من حبات القمح الكاملة المطبوخة في الحليب، محلاة ومغطاة بالمكسرات.' },
        nutrition: { calories: 220, protein: 8, carbs: 40, fat: 4 },
        details: {
            benefits: { en: 'High in fiber and a good source of complex carbs and calcium.', ar: 'غنية بالألياف ومصدر جيد للكربوهيدرات المعقدة والكالسيوم.' },
            recommendation: { en: 'A popular, healthy, and filling breakfast or dessert, especially in winter.', ar: 'إفطار أو حلوى شهيرة وصحية ومشبعة، خاصة في الشتاء.' },
            allergens: { en: 'Gluten, Dairy, Nuts.', ar: 'الغلوتين، الألبان، المكسرات.' }
        }
    },
    {
        id: 94,
        name: { en: 'Stuffed Intestines (Fawaregh)', ar: 'فوارغ' },
        category: 'proteins',
        description: { en: 'Sheep intestines cleaned and stuffed with a seasoned rice mixture, similar to Mombar.', ar: 'أمعاء الخروف المنظفة والمحشوة بخليط الأرز المتبل، تشبه الممبار.' },
        nutrition: { calories: 280, protein: 10, carbs: 20, fat: 18 },
        details: {
            benefits: { en: 'A traditional dish rich in flavor.', ar: 'طبق تقليدي غني بالنكهة.' },
            recommendation: { en: 'Considered a delicacy by many. High in fat and cholesterol.', ar: 'يعتبره الكثيرون من الأطايب. عالي الدهون والكوليسترول.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 95,
        name: { en: 'Shanklish Cheese', ar: 'جبنة شنكليش' },
        category: 'dairy',
        description: { en: 'Aged and dried cheese, often formed into balls and coated in za\'atar or chili flakes.', ar: 'جبنة معتقة ومجففة، غالبًا ما تشكل على هيئة كرات وتغطى بالزعتر أو رقائق الفلفل الحار.' },
        nutrition: { calories: 120, protein: 8, carbs: 2, fat: 9 },
        details: {
            benefits: { en: 'A pungent and flavorful cheese with a long shelf life.', ar: 'جبنة ذات نكهة قوية ولاذعة وعمر تخزين طويل.' },
            recommendation: { en: 'Best crumbled over salads or mixed with tomatoes and onions.', ar: 'يفضل تفتيتها فوق السلطات أو خلطها مع الطماطم والبصل.' },
            allergens: { en: 'Dairy.', ar: 'ألبان.' }
        }
    },
    {
        id: 96,
        name: { en: 'Moussaka (Vegetarian)', ar: 'مسقعة (نباتي)' },
        category: 'vegetables',
        description: { en: 'A version of Mesaka\'a made without meat, sometimes with chickpeas or lentils.', ar: 'نسخة من المسقعة بدون لحم، وأحيانًا بالحمص أو العدس.' },
        nutrition: { calories: 180, protein: 4, carbs: 16, fat: 12 },
        details: {
            benefits: { en: 'A delicious way to enjoy eggplant and vegetables.', ar: 'طريقة لذيذة للاستمتاع بالباذنجان والخضروات.' },
            recommendation: { en: 'A great option for vegetarians. Baking the eggplant is healthier than frying.', ar: 'خيار رائع للنباتيين. خبز الباذنجان صحي أكثر من القلي.' },
            allergens: { en: 'None.', ar: 'لا يوجد.' }
        }
    },
    {
        id: 97,
        name: { en: 'Fried Liver Sandwich', ar: 'ساندويتش كبدة مقلية' },
        category: 'proteins',
        description: { en: 'Thinly sliced liver, breaded and deep-fried, served in bread.', ar: 'شرائح كبدة رقيقة، مغطاة بالبقسماط ومقلية، تقدم في الخبز.' },
        nutrition: { calories: 400, protein: 25, carbs: 35, fat: 18 },
        details: {
            benefits: { en: 'Very high in iron and protein.', ar: 'غنية جدًا بالحديد والبروتين.' },
            recommendation: { en: 'A classic street food sandwich, different from the spicy Eskandarani style.', ar: 'شطيرة طعام شارع كلاسيكية، تختلف عن الأسلوب الإسكندراني الحار.' },
            allergens: { en: 'Gluten.', ar: 'الغلوتين.' }
        }
    },
    {
        id: 98,
        name: { en: 'Jameed', ar: 'جميد' },
        category: 'dairy',
        description: { en: 'Hard, dried yogurt made from sheep or goat\'s milk, used to make sauces.', ar: 'لبن مجفف وصلب مصنوع من حليب الغنم أو الماعز، يستخدم لصنع الصلصات.' },
        nutrition: { calories: 350, protein: 30, carbs: 5, fat: 22 },
        details: {
            benefits: { en: 'A concentrated source of protein and calcium.', ar: 'مصدر مركز للبروتين والكالسيوم.' },
            recommendation: { en: 'A key ingredient in Jordanian Mansaf, but also used in some Egyptian Bedouin cuisine.', ar: 'مكون رئيسي في المنسف الأردني، ولكنه يستخدم أيضًا في بعض المأكولات البدوية المصرية.' },
            allergens: { en: 'Dairy.', ar: 'ألبان.' }
        }
    },
    {
        id: 99,
        name: { en: 'Egyptian Fateer (Sweet)', ar: 'فطير حلو' },
        category: 'snacks',
        description: { en: 'Flaky Feteer pastry filled or topped with sweet ingredients like sugar, milk, honey, or Nutella.', ar: 'فطير هش محشو أو مغطى بمكونات حلوة مثل السكر أو الحليب أو العسل أو النوتيلا.' },
        nutrition: { calories: 500, protein: 7, carbs: 65, fat: 25 },
        details: {
            benefits: { en: 'A decadent and highly satisfying dessert.', ar: 'حلوى فاخرة ومشبعة للغاية.' },
            recommendation: { en: 'A very popular dessert choice from specialized Feteer shops.', ar: 'خيار حلوى شهير جدًا من محلات الفطير المتخصصة.' },
            allergens: { en: 'Gluten, Dairy.', ar: 'الغلوتين، الألبان.' }
        }
    },
    {
        id: 100,
        name: { en: 'Beef Shawarma', ar: 'شاورما لحم' },
        category: 'proteins',
        description: { en: 'Slices of marinated beef cooked on a vertical rotisserie, served in bread.', ar: 'شرائح من اللحم البقري المتبل مطبوخة على شواية عمودية، تقدم في الخبز.' },
        nutrition: { calories: 380, protein: 20, carbs: 30, fat: 20 },
        details: {
            benefits: { en: 'A flavorful source of protein.', ar: 'مصدر لذيذ للبروتين.' },
            recommendation: { en: 'A universally popular sandwich. The fat content can be high depending on the cut of meat.', ar: 'شطيرة شهيرة عالميًا. يمكن أن يكون محتوى الدهون مرتفعًا اعتمادًا على قطعة اللحم.' },
            allergens: { en: 'Gluten (bread).', ar: 'الغلوتين (الخبز).' }
        }
    }
];
