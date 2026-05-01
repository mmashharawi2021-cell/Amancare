# AmanCare / أمان كير

واجهة متجر عناية شخصية عربية RTL بهوية دافئة وفاخرة، تركّز على الخصوصية والراحة وتجربة طلب مباشرة عبر واتساب.

## الهوية الحالية

- الاتجاه: Private Wellness / Warm Luxury.
- الرسالة: Private. Personal. Protected.
- الألوان: Champagne Gold, Creamy Ivory, Warm Sand, Muted Clay, Espresso Charcoal.
- وضع الخصوصية مفعّل افتراضيًا لإخفاء محتوى المنتجات الحساسة.

## المميزات الحالية

- واجهة عربية RTL.
- تصميم دافئ مستوحى من هوية AmanCare.
- Privacy Mode افتراضي ON.
- كشف المنتج الحساس بالمرور على الكمبيوتر أو زر عرض المنتج على الجوال.
- بحث وفلاتر للمنتجات.
- كروت منتجات محسّنة: التوفر، السعر القديم، السعر الحالي، العرض، التفاصيل.
- Modal تفاصيل المنتج بدل alert.
- سلة محلية وإرسال الطلب إلى واتساب.
- لوحة إدارة محلية لإضافة/تعديل/حذف المنتجات.
- دعم حقول: السعر القديم، التوفر، العرض، الحساسية، التصنيف، الوصف، الأيقونة.
- تحسينات للجوال قبل الإطلاق التجريبي.

## بنية الملفات المختصرة

```txt
Amancare/
  index.html
  styles.css
  css/
    brand.css
    search.css
    privacy.css
    product-card.css
    product-modal.css
    admin-upgrade.css
    mobile-fixes.css
  js/
    config.js
    products.js
    helpers.js
    products-ui.js
    cart.js
    admin.js
    main.js
  README.md
  DEVELOPMENT_PLAN.md
```

## لوحة الإدارة

كلمة المرور المؤقتة:

```txt
admin12345
```

> هذه ليست حماية إنتاجية. عند ربط Firebase يجب استبدالها بـ Firebase Authentication.

## رقم واتساب

الرقم المعتمد داخل `js/config.js` بصيغة `wa.me`:

```txt
970568876261
```

## حالة البيانات

حاليًا المنتجات والسلة محفوظة في:

```txt
LocalStorage
```

هذا مناسب للنسخة التجريبية فقط. عند الانتقال للإنتاج يجب استخدام:

```txt
Firebase Firestore + Firebase Authentication + Firebase Storage
```

## التشغيل المحلي

افتح:

```txt
index.html
```

مباشرة في المتصفح.

## GitHub Pages

من إعدادات المستودع:

```txt
Settings → Pages → Branch: main → Folder: /root → Save
```

## الخطوة القادمة

بعد اختبار الجوال والتأكد أن الواجهة مستقرة، المرحلة التالية هي ربط Firebase ونقل المنتجات والطلبات والإعدادات إلى Firestore.
