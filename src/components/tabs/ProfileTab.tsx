"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faTags, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard, faComments } from '@fortawesome/free-regular-svg-icons';

const profileLinks = [
    { text: "Адреса доставки", icon: faMapMarkedAlt, iconColor: "text-blue-600", href: "#" },
    { text: "Способы оплаты", icon: faCreditCard, iconColor: "text-green-600", href: "#" },
    { text: "Мои промокоды", icon: faTags, iconColor: "text-purple-600", href: "#", badge: "2 новых" },
    { text: "Связаться с поддержкой", icon: faComments, iconColor: "text-yellow-600", href: "#" },
];

const deliveryTariffs = [
    { name: "🚀 СвифтЛокал", description: "Самая быстрая доставка (от 30 до 90 минут).", priceInfo: "от 199 ₽", details: "+ 15 ₽/км после 1 км", color: "text-blue-700" },
    { name: "🚲 ЭкоЛокал", description: "Стандартная доставка (в течение 2-4 часов или на след. день).", priceInfo: "от 99 ₽", details: "+ 10 ₽/км после 2 км", color: "text-green-700" },
    { name: "💰 ХабСэйвер", description: "Бесплатная ЭкоЛокал доставка для заказов от 2000 ₽.", priceInfo: "0 ₽", details: "(при сумме заказа > 2000 ₽)", color: "text-purple-700" },
    { name: "🏃 Самовывоз", description: "Заберите заказ самостоятельно у продавца.", priceInfo: "0 ₽", details: "", color: "text-orange-700" },
];


const ProfileTab: React.FC = () => {
  return (
    <div id="profile-tab" className="tab-content p-4">
      <div className="flex items-center mb-6">
        <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60" alt="Аватар" width={64} height={64} className="w-16 h-16 rounded-full mr-4 border-2 border-blue-200 object-cover" />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Алексей Петров</h2>
          <p className="text-sm text-gray-500">+7 (912) 345-67-89</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {profileLinks.map(link => (
          <Link key={link.text} href={link.href}
             className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
            <FontAwesomeIcon icon={link.icon} className={`w-5 text-center ${link.iconColor} mr-3`} />
            <span className="text-gray-700 flex-1">{link.text}</span>
            {link.badge && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full mr-2">{link.badge}</span>
            )}
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
          </Link>
        ))}
      </div>

      <div id="delivery-info" className="bg-white p-4 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Наши тарифы доставки</h3>
        <div className="space-y-3 text-sm">
          {deliveryTariffs.map(tariff => (
            <div key={tariff.name} className="border-b pb-2 last:border-b-0 last:pb-0">
              <p className={`font-medium ${tariff.color}`}>{tariff.name}</p>
              <p className="text-gray-600 text-xs">{tariff.description}</p>
              <p className="text-gray-800 font-medium mt-1">
                {tariff.priceInfo} {tariff.details && <span className="text-gray-500 font-normal">{tariff.details}</span>}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">*Точная стоимость рассчитывается при оформлении заказа и зависит от расстояния и спроса.</p>
      </div>

      <button className="w-full text-center py-2 text-red-600 hover:text-red-800 text-sm">
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default ProfileTab;
