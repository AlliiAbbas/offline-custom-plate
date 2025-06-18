const offlineCalculations = {
    calculate: (data) => {
        return new Promise((resolve, reject) => {
            try {
                console.log('🚀 Starting offline calculations', data);

                // Parse dates
                const fromDate = new Date(data.from_date);
                const toDate = new Date(data.to_date);

                // Calculate months difference
                let months = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + 
                            (toDate.getMonth() - fromDate.getMonth());
                const extraMonth = toDate.getDate() > fromDate.getDate() ? 1 : 0;
                months += extraMonth;

                if (months < 1) {
                    months = 1;
                }

                console.log('📆 Duration calculated (calendar months)', { months });

                // Get vehicle type
                const vehicleType = data.vehicle_type;
                if (!vehicleType) {
                    throw new Error('Vehicle type is required for custom plate pricing');
                }

                // Find custom plate pricing
                const customPlate = findCustomPlatePricing(vehicleType);
                if (!customPlate) {
                    throw new Error('Custom plate pricing not found for vehicle type: ' + vehicleType);
                }

                // Calculate base price
                let basePrice;
                if (customPlate.annual !== null) {
                    if (months <= 12) {
                        basePrice = customPlate.annual;
                    } else {
                        const extraMonths = months - 12;
                        basePrice = customPlate.annual + (extraMonths * customPlate.extra_month);
                    }
                } else {
                    if (months === 1) {
                        basePrice = customPlate.monthly;
                    } else if (months === 2) {
                        basePrice = customPlate.two_months;
                    } else if (months === 3) {
                        basePrice = customPlate.three_months;
                    } else if (months > 3) {
                        const extraMonths = months - 3;
                        basePrice = customPlate.three_months + (extraMonths * customPlate.extra_month);
                    } else {
                        throw new Error(`Invalid number of months: ${months}`);
                    }
                }

                basePrice = Math.round(basePrice);
                console.log('💰 Base price calculated', { basePrice });

                // Calculate extensions
                const extensionsInput = data.extensions || [];
                const extensionsResult = [];
                let extensionsTotal = 0;

                if (extensionsInput.length > 0) {
                    // Combine all extensions into one with total cost of 8
                    const extensionNames = extensionsInput.map(ext => getExtensionName(ext.code)).join(' + ');
                    extensionsResult.push({
                        name: extensionNames,
                        amount: 8,
                        details: {
                            taxes: {
                                fixed_tax: 2.9,
                                issue_fees: 5.1
                            }
                        }
                    });
                    extensionsTotal = 8;
                }

                extensionsTotal = Math.round(extensionsTotal);
                console.log('➕ Extensions calculated', { extensions: extensionsResult });

                // Calculate taxes
                const subtotal = basePrice + extensionsTotal;
                const taxes = calculateTaxes(subtotal);

                // Calculate final total
                const taxTotal = Math.round((taxes.total || 0) * 100) / 100;
                const totalBeforeRounding = subtotal + taxTotal + 5.00;
                const finalTotal = Math.ceil(totalBeforeRounding);
                const roundingDifference = Math.round((finalTotal - totalBeforeRounding) * 100) / 100;
                const issueFees = Math.round((5.00 + roundingDifference) * 100) / 100;

                resolve({
                    base_price: basePrice,
                    taxes: taxes,
                    issue_fees: issueFees,
                    final_total: finalTotal,
                    extensions: extensionsResult,
                    extensions_total: extensionsTotal,
                });
            } catch (error) {
                console.error('❌ Error in offline calculations:', error);
                reject(error);
            }
        });
    },
};

// Helper functions
function findCustomPlatePricing(vehicleType) {
    const customPlates = {
        'دراجة نارية مفردة': { monthly: 50, two_months: 100, three_months: 150, extra_month: 50, annual: null },
        'سايد كار': { monthly: 50, two_months: 100, three_months: 150, extra_month: 50, annual: null },
        'دراجه ناريه صندوق': { monthly: 50, two_months: 100, three_months: 150, extra_month: 50, annual: null },
        'بيتش باجى': { monthly: 50, two_months: 100, three_months: 150, extra_month: 50, annual: null },
        'توك توك': { monthly: 50, two_months: 100, three_months: 150, extra_month: 50, annual: null },
        'جيب مقفوله': { monthly: 150, two_months: 350, three_months: 500, extra_month: 150, annual: null },
        'ليموزين': { monthly: 150, two_months: 350, three_months: 500, extra_month: 150, annual: null },
        'ستيشن': { monthly: 150, two_months: 350, three_months: 500, extra_month: 150, annual: null },
        'كابورليه': { monthly: 150, two_months: 350, three_months: 500, extra_month: 150, annual: null },
        'كوبيه': { monthly: 150, two_months: 350, three_months: 500, extra_month: 150, annual: null },
        'جيب مكشوف': { monthly: 150, two_months: 350, three_months: 500, extra_month: 150, annual: null },
        'هاتشباك': { monthly: 150, two_months: 350, three_months: 500, extra_month: 150, annual: null },
        'ملحقه شاسيه': { monthly: 150, two_months: 350, three_months: 500, extra_month: 150, annual: null },
        'ليموجيب': { monthly: 150, two_months: 350, three_months: 500, extra_month: 150, annual: null },
        'جيب': { monthly: 150, two_months: 350, three_months: 500, extra_month: 150, annual: null },
        'فان مقفوله': { monthly: 200, two_months: 400, three_months: 600, extra_month: 200, annual: null },
        'بيك اب': { monthly: 200, two_months: 400, three_months: 600, extra_month: 200, annual: null },
        'مجهزة مكبس': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'اسعاف': { monthly: 200, two_months: 400, three_months: 600, extra_month: 200, annual: null },
        'فان': { monthly: 200, two_months: 400, three_months: 600, extra_month: 200, annual: null },
        'ملحقه صندوق': { monthly: 200, two_months: 400, three_months: 600, extra_month: 200, annual: null },
        'بيك اب مزدوجه': { monthly: 200, two_months: 400, three_months: 600, extra_month: 200, annual: null },
        'نقل': { monthly: 200, two_months: 400, three_months: 600, extra_month: 200, annual: null },
        'مزدوجه مقفول': { monthly: 200, two_months: 400, three_months: 600, extra_month: 200, annual: null },
        'بيك اب مزدوجه ومقفول': { monthly: 200, two_months: 400, three_months: 600, extra_month: 200, annual: null },
        'سوبر فان': { monthly: 200, two_months: 400, three_months: 600, extra_month: 200, annual: null },
        'معده ثقيله': { monthly: 200, two_months: 400, three_months: 600, extra_month: 200, annual: null },
        'نصف مقطوره سايلون': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'مطافى': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'كارافان': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'مضخه أسمنت': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'مضخه خرسانه': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'ميكروباص': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'نقل مسطح': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'نقل بجوانب': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'صندوق مغلق': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'فنطاس': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'ثلاجه': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'ونش': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'جرار': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'اتوبيس': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'خلاط خرسانه': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'قاطره': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'كساحه': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'مينى باص': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'جريدر': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'لودر': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'حفار': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'ونش بشوكه': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'نصف مقطوره': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'بلدوزر': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'كلارك': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'حامله السيارات': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'مينى فان': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'بيك اب طويل': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'سله اناره': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'اختبارات كهرباء': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'مجسات كهرباء': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'خزان اسمنت': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'ونش تلسكوبى': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'مجهزه ورشه': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'سلم هيدروليكى': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'بكره كابلات': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'جمالون': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'مكنسه نظافه': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'خزينه نقل اموال': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'لفت باك': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'شفاط': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'مكتب متنقل': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'مكبس قمامه': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'هاى روف': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'قفص حديد': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'صندوق شبك': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'جوانب مشمع': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'عياده متنقله': { monthly: 250, two_months: 500, three_months: 800, extra_month: 250, annual: null },
        'قلاب': { monthly: 300, two_months: 600, three_months: 950, extra_month: 300, annual: null },
        'مقطوره': { monthly: 300, two_months: 600, three_months: 950, extra_month: 300, annual: null },
        'طبليه': { monthly: 300, two_months: 600, three_months: 950, extra_month: 300, annual: null },
        'مقطوره مسطح': { monthly: 300, two_months: 600, three_months: 950, extra_month: 300, annual: null },
        'مقطوره بجوانب': { monthly: 300, two_months: 600, three_months: 950, extra_month: 300, annual: null },
        'جرار زراعي': { monthly: null, two_months: null, three_months: null, extra_month: 20, annual: 150 },
        'مقطورة زراعية': { monthly: null, two_months: null, three_months: null, extra_month: 20, annual: 150 }
    };
    return customPlates[vehicleType];
}

function resolveExtension(code, type) {
    const extensions = {
        'Changing_the_name_of_the_insured': {
            calculate: ({ base_installment }) => 8
        },
        'Changing_the_address': {
            calculate: ({ base_installment }) => 8
        },
        'Edit_plate_number': {
            calculate: ({ base_installment }) => 8
        },
        'Modify_chassis_number': {
            calculate: ({ base_installment }) => 8
        },
        'Modify_the_motor_number': {
            calculate: ({ base_installment }) => 8
        }
    };
    return extensions[code];
}

function getExtensionName(code) {
    const extensionNames = {
        'Changing_the_name_of_the_insured': 'تعديل اسم المؤمن له',
        'Changing_the_address': 'تعديل العنوان',
        'Edit_plate_number': 'تعديل رقم اللوحة',
        'Modify_chassis_number': 'تعديل رقم الشاسيه',
        'Modify_the_motor_number': 'تعديل رقم الموتور'
    };
    return extensionNames[code];
}

function calculateTaxes(installment) {
    const tax1 = Math.round(installment * 0.01 * 100) / 100;   // نصف الدمغة النسبية
    const tax2 = Math.round(installment * 0.006 * 100) / 100;  // إشراف ورقابة
    const tax3 = Math.round(installment * 0.001 * 100) / 100;  // مراجعة واعتماد
    const tax4 = 2.90;                                        // ضريبة ثابتة
    const tax5 = 5.00;                                        // مصاريف اصدار

    const total = Math.round((tax1 + tax2 + tax3 + tax4) * 100) / 100;

    // حساب الفرق بعد التقريب
    const totalBeforeRounding = installment + total + tax5;
    const finalTotal = Math.ceil(totalBeforeRounding);
    const roundingDifference = Math.round((finalTotal - totalBeforeRounding) * 100) / 100;
    const issueFees = Math.round((tax5 + roundingDifference) * 100) / 100;

    return {
        stamp_tax: tax1,
        supervision_tax: tax2,
        review_tax: tax3,
        fixed_tax: tax4,
        total: total
    };
}

export default offlineCalculations;