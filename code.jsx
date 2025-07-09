import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { FaHeartbeat, FaUserMd, FaMapMarkerAlt, FaOm, FaGlobe, FaPhone } from "react-

icons/fa";

import io from "socket.io-client";

const socket = io("https://mahakumbh.com");

const doctors = [

 { name: "Dr. Sharma", contact: "9876543210", location: "Sector 10" },

 { name: "Dr. Verma", contact: "9123456789", location: "Sector 20" },

 { name: "Dr. Rao", contact: "9234567890", location: "Sector 15" }

];

const languages = {

 hi: "हिन्दी",

 en: "English",

 bn: "বাাংলা",

 ta: "தமிழ்",

 te: "తెలుగు",

 mr: "मराठी",

 gu: "ગુજરાતી",

 pa: "ਪੰਜਾਬੀ"

};

const translations = {

 hi: { name: "आपका नाम", location: "आपका स्थान", concern: "अपनी स्वास्थ्य समस्या का वर्णन करें", 

request: "सिायता का अनुरोध करें" },

 en: { name: "Your Name", location: "Your Location", concern: "Describe your health concern", 

request: "Request Assistance" },

 bn: { name: "আপনার নাম", location: "আপনার অবস্থান", concern: "আপনার স্বাস্থয সমসযা বর্ ণনা

করুন", request: "সহায়তার জনয অনুররাধ করুন" },

 ta: { name: "உங்கள் பெயர்", location: "உங்கள் இடம்", concern: "உங்கள் உடல் நலெ்

பிரச்சினைனய விவரிக்கவும்", request: "உதவி ககோரவும்" },

 te: { name: "మీ పేరు", location: "మీ ానము", concern: "మీ ఆరోగ్య సమసయ ను వివరించిండి", 

request: "సహాయిం అభ్యరింన చిండి" },

 mr: { name: "तुमचेनाव", location: "तुमचेस्थान", concern: "तुमच्या आरोग्य समस्येचेवर्णन करा", request: 

"मदतीची हवनंती करा" },

 gu: { name: "તમારું નામ", location: "તમારું સ્થાન", concern: "તમારા આરોગ્યની સમસ્યા વર્ણવો", 

request: "સહાય માટેવવનુંતી કરો" },
pa: { name: "ਤੁਹਾਡਾ ਨਾਾਂ", location: "ਤੁਹਾਡੀ ਸਥਿਤੀ", concern: "ਆਪਣੀ ਥਸਹਤ ਸੰਬੰਧੀ ਥ ੰਤਾ ਦਾ ਵੇਰਵਾ ਥਦਓ", 

request: "ਮਦਦ ਦੀ ਬੇਨਤੀ ਕਰੋ" }

};

export default function HealthAssistance() {

 const [messages, setMessages] = useState([]);

 const [message, setMessage] = useState("");

 const [name, setName] = useState("");

 const [location, setLocation] = useState("");

 const [language, setLanguage] = useState("hi");

 const [nearbyDoctors, setNearbyDoctors] = useState([]);

 useEffect(() => {

 socket.on("receiveMessage", (data) => {

 setMessages((prev) => [...prev, data]);

 });

 return () => {

 socket.off("receiveMessage");

 };

 }, []);

 const findNearbyDoctors = (userLocation) => {

 const nearby = doctors.filter(doctor => 

doctor.location.toLowerCase().includes(userLocation.toLowerCase()));

 setNearbyDoctors(nearby);

 };

 return (

 <div className="p-6 bg-gradient-to-r from-orange-200 to-yellow-100 min-h-screen flex flex-col 

items-center">

 <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-3 text-black shadow-lg font-

serif">

 <FaOm className="text-yellow-600" /> MahaKumbh 2025 - Real-Time Health Assistance

 </h1>

 <select

 className="mb-4 p-2 border border-orange-400 rounded-full text-lg text-black"

 value={language}

 onChange={(e) => setLanguage(e.target.value)}

 >

 {Object.keys(languages).map((lang) => (

 <option key={lang} value={lang}>{languages[lang]}</option>

 ))}

 </select>

 <Card className="w-full max-w-lg p-5 bg-yellow-100 border-orange-400 border-2 shadow-2xl 

rounded-3xl text-black">

 <CardContent className="flex flex-col gap-5">

 <Input

 placeholder={translations[language].name}

 value={name}
 onChange={(e) => setName(e.target.value)}

 className="border-orange-400 rounded-full text-lg text-black"

 />

 <Input

 placeholder={translations[language].location}

 value={location}

 onChange={(e) => {

 setLocation(e.target.value);

 findNearbyDoctors(e.target.value);

 }}

 className="border-orange-400 rounded-full text-lg text-black"

 />

 <Textarea

 placeholder={translations[language].concern}

 value={message}

 onChange={(e) => setMessage(e.target.value)}

 className="border-orange-400 rounded-3xl text-lg text-black"

 />

 <Button onClick={() => socket.emit("sendMessage", { name, location, message: `${name} 

requested assistance: ${message}` })} className="bg-red-600 hover:bg-red-700 text-white rounded-

full text-lg">

 {translations[language].request}

 </Button>

 {nearbyDoctors.length > 0 && (

 <div className="mt-5 p-4 bg-white border border-orange-400 rounded-xl shadow-lg">

 <h2 className="text-lg font-semibold text-black mb-2">Available Doctors:</h2>

 {nearbyDoctors.map((doctor, index) => (

 <div key={index} className="flex justify-between items-center border-b border-orange-

300 pb-2 mb-2">

 <span className="text-black"><FaUserMd className="inline-block mr-2 text-red-600" 

/> {doctor.name}</span>

 <span className="text-black"><FaPhone className="inline-block mr-2 text-green-600" 

/> {doctor.contact}</span>

 </div>

 ))}

 </div>

 )}

 </CardContimport { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { FaHeartbeat, FaUserMd, FaMapMarkerAlt, FaOm, FaGlobe, FaPhone } from "react-

icons/fa";

import io from "socket.io-client";

const socket = io("https://mahakumbh.com");

const doctors = [

 { name: "Dr. Sharma", contact: "9876543210", location: "Sector 10" },

 { name: "Dr. Verma", contact: "9123456789", location: "Sector 20" },

 { name: "Dr. Rao", contact: "9234567890", location: "Sector 15" }

];

const languages = {

 hi: "हिन्दी",

 en: "English",

 bn: "বাাংলা",

 ta: "தமிழ்",

 te: "తెలుగు",

 mr: "मराठी",

 gu: "ગુજરાતી",

 pa: "ਪੰਜਾਬੀ"

};

const translations = {

 hi: { name: "आपका नाम", location: "आपका स्थान", concern: "अपनी स्वास्थ्य समस्या का वर्णन करें", 

request: "सिायता का अनुरोध करें" },

 en: { name: "Your Name", location: "Your Location", concern: "Describe your health concern", 

request: "Request Assistance" },

 bn: { name: "আপনার নাম", location: "আপনার অবস্থান", concern: "আপনার স্বাস্থয সমসযা বর্ ণনা

করুন", request: "সহায়তার জনয অনুররাধ করুন" },

 ta: { name: "உங்கள் பெயர்", location: "உங்கள் இடம்", concern: "உங்கள் உடல் நலெ்

பிரச்சினைனய விவரிக்கவும்", request: "உதவி ககோரவும்" },

 te: { name: "మీ పేరు", location: "మీ ానము", concern: "మీ ఆరోగ్య సమసయ ను వివరించిండి", 

request: "సహాయిం అభ్యరింన చిండి" },

 mr: { name: "तुमचेनाव", location: "तुमचेस्थान", concern: "तुमच्या आरोग्य समस्येचेवर्णन करा", request: 

"मदतीची हवनंती करा" },

 gu: { name: "તમારું નામ", location: "તમારું સ્થાન", concern: "તમારા આરોગ્યની સમસ્યા વર્ણવો", 

request: "સહાય માટેવવનુંતી કરો" },
pa: { name: "ਤੁਹਾਡਾ ਨਾਾਂ", location: "ਤੁਹਾਡੀ ਸਥਿਤੀ", concern: "ਆਪਣੀ ਥਸਹਤ ਸੰਬੰਧੀ ਥ ੰਤਾ ਦਾ ਵੇਰਵਾ ਥਦਓ", 

request: "ਮਦਦ ਦੀ ਬੇਨਤੀ ਕਰੋ" }

};

export default function HealthAssistance() {

 const [messages, setMessages] = useState([]);

 const [message, setMessage] = useState("");

 const [name, setName] = useState("");

 const [location, setLocation] = useState("");

 const [language, setLanguage] = useState("hi");

 const [nearbyDoctors, setNearbyDoctors] = useState([]);

 useEffect(() => {

 socket.on("receiveMessage", (data) => {

 setMessages((prev) => [...prev, data]);

 });

 return () => {

 socket.off("receiveMessage");

 };

 }, []);

 const findNearbyDoctors = (userLocation) => {

 const nearby = doctors.filter(doctor => 

doctor.location.toLowerCase().includes(userLocation.toLowerCase()));

 setNearbyDoctors(nearby);

 };

 return (

 <div className="p-6 bg-gradient-to-r from-orange-200 to-yellow-100 min-h-screen flex flex-col 

items-center">

 <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-3 text-black shadow-lg font-

serif">

 <FaOm className="text-yellow-600" /> MahaKumbh 2025 - Real-Time Health Assistance

 </h1>

 <select

 className="mb-4 p-2 border border-orange-400 rounded-full text-lg text-black"

 value={language}

 onChange={(e) => setLanguage(e.target.value)}

 >

 {Object.keys(languages).map((lang) => (

 <option key={lang} value={lang}>{languages[lang]}</option>

 ))}

 </select>

 <Card className="w-full max-w-lg p-5 bg-yellow-100 border-orange-400 border-2 shadow-2xl 

rounded-3xl text-black">

 <CardContent className="flex flex-col gap-5">

 <Input

 placeholder={translations[language].name}

 value={name}
 onChange={(e) => setName(e.target.value)}

 className="border-orange-400 rounded-full text-lg text-black"

 />

 <Input

 placeholder={translations[language].location}

 value={location}

 onChange={(e) => {

 setLocation(e.target.value);

 findNearbyDoctors(e.target.value);

 }}

 className="border-orange-400 rounded-full text-lg text-black"

 />

 <Textarea

 placeholder={translations[language].concern}

 value={message}

 onChange={(e) => setMessage(e.target.value)}

 className="border-orange-400 rounded-3xl text-lg text-black"

 />
import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { FaHeartbeat, FaUserMd, FaMapMarkerAlt, FaOm, FaGlobe, FaPhone } from "react-

icons/fa";

import io from "socket.io-client";

const socket = io("https://mahakumbh.com");

const doctors = [

 { name: "Dr. Sharma", contact: "9876543210", location: "Sector 10" },

 { name: "Dr. Verma", contact: "9123456789", location: "Sector 20" },

 { name: "Dr. Rao", contact: "9234567890", location: "Sector 15" }

];

const languages = {

 hi: "हिन्दी",

 en: "English",

 bn: "বাাংলা",

 ta: "தமிழ்",

 te: "తెలుగు",

 mr: "मराठी",

 gu: "ગુજરાતી",

 pa: "ਪੰਜਾਬੀ"

};

const translations = {

 hi: { name: "आपका नाम", location: "आपका स्थान", concern: "अपनी स्वास्थ्य समस्या का वर्णन करें", 

request: "सिायता का अनुरोध करें" },

 en: { name: "Your Name", location: "Your Location", concern: "Describe your health concern", 

request: "Request Assistance" },

 bn: { name: "আপনার নাম", location: "আপনার অবস্থান", concern: "আপনার স্বাস্থয সমসযা বর্ ণনা

করুন", request: "সহায়তার জনয অনুররাধ করুন" },

 ta: { name: "உங்கள் பெயர்", location: "உங்கள் இடம்", concern: "உங்கள் உடல் நலெ்

பிரச்சினைனய விவரிக்கவும்", request: "உதவி ககோரவும்" },

 te: { name: "మీ పేరు", location: "మీ ానము", concern: "మీ ఆరోగ్య సమసయ ను వివరించిండి", 

request: "సహాయిం అభ్యరింన చిండి" },

 mr: { name: "तुमचेनाव", location: "तुमचेस्थान", concern: "तुमच्या आरोग्य समस्येचेवर्णन करा", request: 

"मदतीची हवनंती करा" },

 gu: { name: "તમારું નામ", location: "તમારું સ્થાન", concern: "તમારા આરોગ્યની સમસ્યા વર્ણવો", 

request: "સહાય માટેવવનુંતી કરો" },
pa: { name: "ਤੁਹਾਡਾ ਨਾਾਂ", location: "ਤੁਹਾਡੀ ਸਥਿਤੀ", concern: "ਆਪਣੀ ਥਸਹਤ ਸੰਬੰਧੀ ਥ ੰਤਾ ਦਾ ਵੇਰਵਾ ਥਦਓ", 

request: "ਮਦਦ ਦੀ ਬੇਨਤੀ ਕਰੋ" }

};

export default function HealthAssistance() {

 const [messages, setMessages] = useState([]);

 const [message, setMessage] = useState("");

 const [name, setName] = useState("");

 const [location, setLocation] = useState("");

 const [language, setLanguage] = useState("hi");

 const [nearbyDoctors, setNearbyDoctors] = useState([]);

 useEffect(() => {

 socket.on("receiveMessage", (data) => {

 setMessages((prev) => [...prev, data]);

 });

 return () => {

 socket.off("receiveMessage");

 };

 }, []);

 const findNearbyDoctors = (userLocation) => {

 const nearby = doctors.filter(doctor => 

doctor.location.toLowerCase().includes(userLocation.toLowerCase()));

 setNearbyDoctors(nearby);

 };

 return (

 <div className="p-6 bg-gradient-to-r from-orange-200 to-yellow-100 min-h-screen flex flex-col 

items-center">

 <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-3 text-black shadow-lg font-

serif">

 <FaOm className="text-yellow-600" /> MahaKumbh 2025 - Real-Time Health Assistance

 </h1>

 <select

 className="mb-4 p-2 border border-orange-400 rounded-full text-lg text-black"

 value={language}

 onChange={(e) => setLanguage(e.target.value)}

 >

 {Object.keys(languages).map((lang) => (

 <option key={lang} value={lang}>{languages[lang]}</option>

 ))}

 </select>

 <Card className="w-full max-w-lg p-5 bg-yellow-100 border-orange-400 border-2 shadow-2xl 

rounded-3xl text-black">

 <CardContent className="flex flex-col gap-5">

 <Input

 placeholder={translations[language].name}

 value={name}
 onChange={(e) => setName(e.target.value)}

 className="border-orange-400 rounded-full text-lg text-black"

 />

 <Input

 placeholder={translations[language].location}

 value={location}

 onChange={(e) => {

 setLocation(e.target.value);

 findNearbyDoctors(e.target.value);

 }}

 className="border-orange-400 rounded-full text-lg text-black"

 />

 <Textarea

 placeholder={translations[language].concern}

 value={message}

 onChange={(e) => setMessage(e.target.value)}

 className="border-orange-400 rounded-3xl text-lg text-black"

 />

 <Button onClick={() => socket.emit("sendMessage", { name, location, message: `${name} 

requested assistance: ${message}` })} className="bg-red-600 hover:bg-red-700 text-white rounded-

full text-lg">

 {translations[language].request}

 </Button>

 {nearbyDoctors.length > 0 && (

 <div className="mt-5 p-4 bg-white border border-orange-400 rounded-xl shadow-lg">

 <h2 className="text-lg font-semibold text-black mb-2">Available Doctors:</h2>

 {nearbyDoctors.map((doctor, index) => (

 <div key={index} className="flex justify-between items-center border-b border-orange-

300 pb-2 mb-2">

 <span className="text-black"><FaUserMd className="inline-block mr-2 text-red-600" 

/> {doctor.name}</span>

 <span className="text-black"><FaPhone className="inline-block mr-2 text-green-600" 

/> {doctor.contact}</span>

 </div>

 ))}

 </div>

 )}

 </CardContimport { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { FaHeartbeat, FaUserMd, FaMapMarkerAlt, FaOm, FaGlobe, FaPhone } from "react-

icons/fa";

import io from "socket.io-client";

const socket = io("https://mahakumbh.com");

const doctors = [

 { name: "Dr. Sharma", contact: "9876543210", location: "Sector 10" },

 { name: "Dr. Verma", contact: "9123456789", location: "Sector 20" },

 { name: "Dr. Rao", contact: "9234567890", location: "Sector 15" }

];

const languages = {

 hi: "हिन्दी",

 en: "English",

 bn: "বাাংলা",

 ta: "தமிழ்",

 te: "తెలుగు",

 mr: "मराठी",

 gu: "ગુજરાતી",

 pa: "ਪੰਜਾਬੀ"

};

const translations = {

 hi: { name: "आपका नाम", location: "आपका स्थान", concern: "अपनी स्वास्थ्य समस्या का वर्णन करें", 

request: "सिायता का अनुरोध करें" },

 en: { name: "Your Name", location: "Your Location", concern: "Describe your health concern", 

request: "Request Assistance" },

 bn: { name: "আপনার নাম", location: "আপনার অবস্থান", concern: "আপনার স্বাস্থয সমসযা বর্ ণনা

করুন", request: "সহায়তার জনয অনুররাধ করুন" },

 ta: { name: "உங்கள் பெயர்", location: "உங்கள் இடம்", concern: "உங்கள் உடல் நலெ்

பிரச்சினைனய விவரிக்கவும்", request: "உதவி ககோரவும்" },

 te: { name: "మీ పేరు", location: "మీ ానము", concern: "మీ ఆరోగ్య సమసయ ను వివరించిండి", 

request: "సహాయిం అభ్యరింన చిండి" },

 mr: { name: "तुमचेनाव", location: "तुमचेस्थान", concern: "तुमच्या आरोग्य समस्येचेवर्णन करा", request: 

"मदतीची हवनंती करा" },

 gu: { name: "તમારું નામ", location: "તમારું સ્થાન", concern: "તમારા આરોગ્યની સમસ્યા વર્ણવો", 

request: "સહાય માટેવવનુંતી કરો" },
pa: { name: "ਤੁਹਾਡਾ ਨਾਾਂ", location: "ਤੁਹਾਡੀ ਸਥਿਤੀ", concern: "ਆਪਣੀ ਥਸਹਤ ਸੰਬੰਧੀ ਥ ੰਤਾ ਦਾ ਵੇਰਵਾ ਥਦਓ", 

request: "ਮਦਦ ਦੀ ਬੇਨਤੀ ਕਰੋ" }

};

export default function HealthAssistance() {

 const [messages, setMessages] = useState([]);

 const [message, setMessage] = useState("");

 const [name, setName] = useState("");

 const [location, setLocation] = useState("");

 const [language, setLanguage] = useState("hi");

 const [nearbyDoctors, setNearbyDoctors] = useState([]);

 useEffect(() => {

 socket.on("receiveMessage", (data) => {

 setMessages((prev) => [...prev, data]);

 });

 return () => {

 socket.off("receiveMessage");

 };

 }, []);

 const findNearbyDoctors = (userLocation) => {

 const nearby = doctors.filter(doctor => 

doctor.location.toLowerCase().includes(userLocation.toLowerCase()));

 setNearbyDoctors(nearby);

 };

 return (

 <div className="p-6 bg-gradient-to-r from-orange-200 to-yellow-100 min-h-screen flex flex-col 

items-center">

 <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-3 text-black shadow-lg font-

serif">

 <FaOm className="text-yellow-600" /> MahaKumbh 2025 - Real-Time Health Assistance

 </h1>

 <select

 className="mb-4 p-2 border border-orange-400 rounded-full text-lg text-black"

 value={language}

 onChange={(e) => setLanguage(e.target.value)}

 >

 {Object.keys(languages).map((lang) => (

 <option key={lang} value={lang}>{languages[lang]}</option>

 ))}

 </select>

 <Card className="w-full max-w-lg p-5 bg-yellow-100 border-orange-400 border-2 shadow-2xl 

rounded-3xl text-black">

 <CardContent className="flex flex-col gap-5">

 <Input

 placeholder={translations[language].name}

 value={name}
 onChange={(e) => setName(e.target.value)}

 className="border-orange-400 rounded-full text-lg text-black"

 />

 <Input

 placeholder={translations[language].location}

 value={location}

 onChange={(e) => {

 setLocation(e.target.value);

 findNearbyDoctors(e.target.value);

 }}

 className="border-orange-400 rounded-full text-lg text-black"

 />

 <Textarea

 placeholder={translations[language].concern}

 value={message}

 onChange={(e) => setMessage(e.target.value)}

 className="border-orange-400 rounded-3xl text-lg text-black"

 />

 <Button onClick={() => socket.emit("sendMessage", { name, location, message: `${name} 

requested assistance: ${message}` })} className="bg-red-600 hover:bg-red-700 text-white rounded-

full text-lg">

 {translations[language].request}

 </Button>

 {nearbyDoctors.length > 0 && (

 <div className="mt-5 p-4 bg-white border border-orange-400 rounded-xl shadow-lg">

 <h2 className="text-lg font-semibold text-black mb-2">Available Doctors:</h2>

 {nearbyDoctors.map((doctor, index) => (

 <div key={index} className="flex justify-between items-center border-b border-orange-

300 pb-2 mb-2">

 <span className="text-black"><FaUserMd className="inline-block mr-2 text-red-600" 

/> {doctor.name}</span>

 <span className="text-black"><FaPhone className="inline-block mr-2 text-green-600" 

/> {doctor.contact}</span>

 </div>

 ))}

 </div>

 )}

 </CardContent>

 </Card>

 </div>

 );

}ent>

 </Card>

 </div>

 );

}
 <Button onClick={() => socket.emit("sendMessage", { name, location, message: `${name} 

requested assistance: ${message}` })} className="bg-red-600 hover:bg-red-700 text-white rounded-

full text-lg">

 {translations[language].request}

 </Button>

 {nearbyDoctors.length > 0 && (

 <div className="mt-5 p-4 bg-white border border-orange-400 rounded-xl shadow-lg">

 <h2 className="text-lg font-semibold text-black mb-2">Available Doctors:</h2>

 {nearbyDoctors.map((doctor, index) => (

 <div key={index} className="flex justify-between items-center border-b border-orange-

300 pb-2 mb-2">

 <span className="text-black"><FaUserMd className="inline-block mr-2 text-red-600" 

/> {doctor.name}</span>

 <span className="text-black"><FaPhone className="inline-block mr-2 text-green-600" 

/> {doctor.contact}</span>

 </div>

 ))}

 </div>

 )}

 </CardContent>

 </Card>

 </div>

 );

}ent>

 </Card>

 </div>

 );

}
