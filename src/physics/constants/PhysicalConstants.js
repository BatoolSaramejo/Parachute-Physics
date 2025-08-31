
// الجاذبية الأرضية
export const GRAVITY = 9.81; // m/s²

// كثافة الهواء على سطح البحر
export const AIR_DENSITY_SEA_LEVEL = 1.225; // kg/m³

// ثابت الزمن الافتراضي لتأثير التصادم (زمن التلامس)
export const COLLISION_DELTA_TIME = 0.2; // seconds

// معامل كتلة الدوران التقريبي لجسم بشري (لعزم الدوران)
export const MOMENT_OF_INERTIA = 20; // kg·m² (تقريبي جداً)

// أقصى قوة شد ممكنة للحبال قبل الانقطاع)
export const MAX_TENSION_FORCE = 5000; // Newtons

// معامل الاحتكاك الأرضي (لو في احتكاك عند التصادم)
export const GROUND_FRICTION_COEFF = 0.6; // Unitless

// كثافة القماش النموذجية للمظلة (للدقة في مقاومة الهواء)
export const CANOPY_MATERIAL_DENSITY = 0.4; // kg/m²

// مساحة مظلة دائرية افتراضية
export const DEFAULT_CANOPY_AREA = 25; // m²

