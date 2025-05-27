import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, Moon, Thermometer, Droplet, AlertTriangle, MessageSquare } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const mockSensorData = [
  { time: '08:00', temp: 25, humidity: 60 },
  { time: '09:00', temp: 26, humidity: 58 },
  { time: '10:00', temp: 27, humidity: 55 },
  { time: '11:00', temp: 28, humidity: 53 },
  { time: '12:00', temp: 29, humidity: 50 },
];

const sensors = [
  { id: 1, name: 'Temp Capteur 1', lat: 3.848, lng: 11.502, value: '29°C' },
  { id: 2, name: 'Sol Capteur 1', lat: 3.85, lng: 11.50, value: 'Humidité 55%' },
];

export default function DashboardAgriK() {
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState('fr');
  const [chat, setChat] = useState('');
  const [response, setResponse] = useState('');

  const toggleDark = () => setDarkMode(!darkMode);
  const toggleLang = () => setLang(lang === 'fr' ? 'en' : 'fr');

  const handleAsk = async () => {
    const res = await fetch('https://api.agro-dashboard.com/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '7b8b3bead4dcab9b3b6344798219b847',
      },
      body: JSON.stringify({ prompt: chat }),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <div className="flex h-screen">
        <aside className="w-20 bg-green-900 text-white p-4 flex flex-col items-center gap-6">
          <Thermometer />
          <Droplet />
          <AlertTriangle />
          <MessageSquare />
        </aside>

        <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-300">
              {lang === 'fr' ? 'Tableau de bord AgriK' : 'AgriK Dashboard'}
            </h1>
            <div className="flex gap-2">
              <button onClick={toggleLang}>{lang.toUpperCase()}</button>
              <button onClick={toggleDark}>{darkMode ? <Sun /> : <Moon />}</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <Thermometer className="text-red-500" />
              <p className="text-sm">{lang === 'fr' ? 'Température' : 'Temperature'}</p>
              <p className="text-lg font-bold">29°C</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <Droplet className="text-blue-500" />
              <p className="text-sm">{lang === 'fr' ? 'Humidité' : 'Humidity'}</p>
              <p className="text-lg font-bold">55%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <AlertTriangle className="text-yellow-500" />
              <p className="text-sm">{lang === 'fr' ? 'Alertes' : 'Alerts'}</p>
              <p className="text-lg font-bold">Aucune</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <MessageSquare className="text-green-500" />
              <p className="text-sm">Chat IA</p>
              <p className="text-xs">{response || '...'}</p>
            </div>
          </div>

          <div className="h-64 rounded-xl overflow-hidden mb-4">
            <MapContainer center={[3.848, 11.502]} zoom={13} className="h-full w-full">
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              {sensors.map(sensor => (
                <Marker key={sensor.id} position={[sensor.lat, sensor.lng]}>
                  <Popup>{sensor.name}: {sensor.value}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-4">
            <h2 className="text-xl font-bold mb-2">{lang === 'fr' ? 'Évolution des capteurs' : 'Sensor Trends'}</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockSensorData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temp" stroke="#ff7300" />
                <Line type="monotone" dataKey="humidity" stroke="#387908" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-2">Assistant IA</h2>
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 rounded border"
                placeholder={lang === 'fr' ? 'Posez une question...' : 'Ask something...'}
                value={chat}
                onChange={e => setChat(e.target.value)}
              />
              <button onClick={handleAsk} className="bg-green-600 text-white px-4 py-2 rounded">
                Ask
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
