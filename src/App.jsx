import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Package, ClipboardList, ArrowRight, Lightbulb, DollarSign } from 'lucide-react';
import MapDisplay from './MapDisplay';

function ExampleCard({ icon, title, description, action, color, delay }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    cyan: 'from-cyan-500 to-cyan-600',
    pink: 'from-pink-500 to-pink-600',
    orange: 'from-orange-500 to-orange-600',
    indigo: 'from-indigo-500 to-indigo-600',
    rose: 'from-rose-500 to-rose-600',
  };

  return (
    <div ref={cardRef} className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
      <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-2xl p-8 shadow-xl text-white`}>
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-lg text-white/90 mb-4">{description}</p>
        <p className="text-xl font-semibold">{action}</p>
      </div>
    </div>
  );
}

export default function ErrandServiceApp() {
  const [step, setStep] = useState('select-type');
  const [serviceType, setServiceType] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [errandLocation, setErrandLocation] = useState('');
  const [signCurrentLocation, setSignCurrentLocation] = useState('');
  const [signDestinationLocation, setSignDestinationLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [errandCoords, setErrandCoords] = useState(null);
  const [signCurrentCoords, setSignCurrentCoords] = useState(null);
  const [signDestinationCoords, setSignDestinationCoords] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [userEstimatedHours, setUserEstimatedHours] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeOption, setTimeOption] = useState('');
  const [specificTime, setSpecificTime] = useState('');
  const [windowStartTime, setWindowStartTime] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSameDayMessage, setShowSameDayMessage] = useState(false);
  const [numberOfSigns, setNumberOfSigns] = useState(3);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  const pickupInputRef = useRef(null);
  const dropoffInputRef = useRef(null);
  const errandInputRef = useRef(null);
  const signDestinationInputRef = useRef(null);
  const googleMapsLoaded = useRef(false);

  const BASE_ADDRESS_COORDS = { lat: 34.0489, lon: -84.2938 };

  // Load Google Maps script
  useEffect(() => {
    if (!googleMapsLoaded.current) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        googleMapsLoaded.current = true;
        setGoogleLoaded(true);
      };
      document.head.appendChild(script);
    } else if (window.google && window.google.maps) {
      setGoogleLoaded(true);
    }
  }, []);

  // Setup Google Places Autocomplete for pickup
  useEffect(() => {
    if (googleLoaded && pickupInputRef.current && window.google && window.google.maps && step === 'enter-locations' && serviceType === 'delivery') {
      const autocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'geometry', 'formatted_address', 'name'],
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setPickupLocation(place.formatted_address || place.name);
          setPickupCoords({
            lat: place.geometry.location.lat(),
            lon: place.geometry.location.lng()
          });
        }
      });
    }
  }, [googleLoaded, step, serviceType]);

  // Setup Google Places Autocomplete for dropoff
  useEffect(() => {
    if (googleLoaded && dropoffInputRef.current && window.google && window.google.maps && step === 'enter-locations' && serviceType === 'delivery') {
      const autocomplete = new window.google.maps.places.Autocomplete(dropoffInputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'geometry', 'formatted_address', 'name'],
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setDropoffLocation(place.formatted_address || place.name);
          setDropoffCoords({
            lat: place.geometry.location.lat(),
            lon: place.geometry.location.lng()
          });
        }
      });
    }
  }, [googleLoaded, step, serviceType]);

  // Setup Google Places Autocomplete for errand
  useEffect(() => {
    if (googleLoaded && errandInputRef.current && window.google && window.google.maps && step === 'enter-locations' && serviceType === 'errand') {
      const autocomplete = new window.google.maps.places.Autocomplete(errandInputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'geometry', 'formatted_address', 'name'],
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setErrandLocation(place.formatted_address || place.name);
          setErrandCoords({
            lat: place.geometry.location.lat(),
            lon: place.geometry.location.lng()
          });
        }
      });
    }
  }, [googleLoaded, step, serviceType]);

  // Setup Google Places Autocomplete for sign current location
  useEffect(() => {
    if (googleLoaded && errandInputRef.current && window.google && window.google.maps && step === 'enter-locations' && (serviceType === 'single-sign' || serviceType === 'multiple-signs')) {
      const autocomplete = new window.google.maps.places.Autocomplete(errandInputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'geometry', 'formatted_address', 'name'],
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setSignCurrentLocation(place.formatted_address || place.name);
          setSignCurrentCoords({
            lat: place.geometry.location.lat(),
            lon: place.geometry.location.lng()
          });
        }
      });
    }
  }, [googleLoaded, step, serviceType]);

  // Setup Google Places Autocomplete for sign destination location
  useEffect(() => {
    if (googleLoaded && signDestinationInputRef.current && window.google && window.google.maps && step === 'enter-locations' && (serviceType === 'single-sign' || serviceType === 'multiple-signs')) {
      const autocomplete = new window.google.maps.places.Autocomplete(signDestinationInputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'geometry', 'formatted_address', 'name'],
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setSignDestinationLocation(place.formatted_address || place.name);
          setSignDestinationCoords({
            lat: place.geometry.location.lat(),
            lon: place.geometry.location.lng()
          });
        }
      });
    }
  }, [googleLoaded, step, serviceType]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateTotalMileage = () => {
    let totalDistance = 0;
    if (serviceType === 'delivery' && pickupCoords && dropoffCoords) {
      const officeToPickup = calculateDistance(BASE_ADDRESS_COORDS.lat, BASE_ADDRESS_COORDS.lon, parseFloat(pickupCoords.lat), parseFloat(pickupCoords.lon));
      const pickupToDropoff = calculateDistance(parseFloat(pickupCoords.lat), parseFloat(pickupCoords.lon), parseFloat(dropoffCoords.lat), parseFloat(dropoffCoords.lon));
      const dropoffToOffice = calculateDistance(parseFloat(dropoffCoords.lat), parseFloat(dropoffCoords.lon), BASE_ADDRESS_COORDS.lat, BASE_ADDRESS_COORDS.lon);
      totalDistance = officeToPickup + pickupToDropoff + dropoffToOffice;
    } else if ((serviceType === 'single-sign' || serviceType === 'multiple-signs') && signCurrentCoords && signDestinationCoords) {
      const officeToCurrentLocation = calculateDistance(BASE_ADDRESS_COORDS.lat, BASE_ADDRESS_COORDS.lon, parseFloat(signCurrentCoords.lat), parseFloat(signCurrentCoords.lon));
      const currentToDestination = calculateDistance(parseFloat(signCurrentCoords.lat), parseFloat(signCurrentCoords.lon), parseFloat(signDestinationCoords.lat), parseFloat(signDestinationCoords.lon));
      const destinationToOffice = calculateDistance(parseFloat(signDestinationCoords.lat), parseFloat(signDestinationCoords.lon), BASE_ADDRESS_COORDS.lat, BASE_ADDRESS_COORDS.lon);
      totalDistance = officeToCurrentLocation + currentToDestination + destinationToOffice;
    } else if (serviceType === 'errand' && errandCoords) {
      const oneWay = calculateDistance(BASE_ADDRESS_COORDS.lat, BASE_ADDRESS_COORDS.lon, parseFloat(errandCoords.lat), parseFloat(errandCoords.lon));
      totalDistance = oneWay * 2;
    }
    return totalDistance;
  };

  const calculateMinimumTime = () => {
    let minimumHours = 0.5; // Base 30 minutes

    const totalMiles = calculateTotalMileage();
    // Each 15 miles adds 30 minutes (0.5 hours)
    const mileageTime = totalMiles / 30;
    minimumHours += mileageTime;

    // Each 6 signs adds 30 minutes (0.5 hours)
    if ((serviceType === 'single-sign' || serviceType === 'multiple-signs') && numberOfSigns) {
      const signTime = Math.ceil(numberOfSigns / 6) * 0.5;
      minimumHours += signTime;
    }

    // Round to nearest 0.5 hour and enforce minimum
    return Math.max(0.5, Math.ceil(minimumHours * 2) / 2);
  };

  useEffect(() => {
    if ((serviceType === 'delivery' && pickupCoords && dropoffCoords) || (serviceType === 'single-sign' && signCurrentCoords && signDestinationCoords) || (serviceType === 'multiple-signs' && signCurrentCoords && signDestinationCoords) || (serviceType === 'errand' && errandCoords)) {
      const minTime = calculateMinimumTime();
      if (userEstimatedHours < minTime) {
        setUserEstimatedHours(minTime);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupCoords, dropoffCoords, errandCoords, signCurrentCoords, signDestinationCoords, serviceType]);

  const calculatePricing = () => {
    const BASE_PRICE = 75;
    const MILEAGE_RATE = 1.50;
    const HOURLY_RATE = 60;
    let MARKUP = 0.25;
    if (timeOption === 'anytime') MARKUP = 0.10;
    else if (timeOption === 'window') MARKUP = 0.25;
    else if (timeOption === 'specific') MARKUP = 0.60;
    const totalDistance = calculateTotalMileage();
    const mileage = totalDistance * MILEAGE_RATE;
    const additionalHours = Math.max(0, userEstimatedHours - 1);
    const timeCost = additionalHours * HOURLY_RATE;
    
    // Add $5 per sign for multiple signs (after the first one)
    let signCost = 0;
    if (serviceType === 'multiple-signs' && numberOfSigns > 1) {
      signCost = (numberOfSigns - 1) * 5;
    }
    
    const subtotal = BASE_PRICE + mileage + timeCost + signCost;
    const markupAmount = subtotal * MARKUP;
    const total = subtotal + markupAmount;
    return { basePrice: BASE_PRICE, distance: totalDistance, mileageCost: mileage, timeCost: timeCost, signCost: signCost, subtotal: subtotal, markupAmount: markupAmount, markupPercent: MARKUP * 100, total: total };
  };

  const isToday = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(dateString + 'T00:00:00');
    selectedDateObj.setHours(0, 0, 0, 0);
    return selectedDateObj.getTime() === today.getTime();
  };

  const isLocationFormValid = () => {
    if (serviceType === 'delivery') {
      return pickupLocation.trim() && dropoffLocation.trim() && selectedDate && timeOption && !isToday(selectedDate);
    } else if (serviceType === 'single-sign' || serviceType === 'multiple-signs') {
      return signCurrentLocation.trim() && signDestinationLocation.trim() && selectedDate && timeOption && !isToday(selectedDate);
    }
    return (pickupLocation.trim() || errandLocation.trim()) && selectedDate && timeOption && !isToday(selectedDate);
  };

  const handleServiceSelect = (type) => {
    setServiceType(type);
    setStep('enter-locations');
  };

  const handleFormspreeSubmit = async () => {
    setIsSubmitting(true);
    const pricing = calculatePricing();
    const submissionTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'long' });
    const formData = {
      customerName, customerPhone, customerEmail,
      serviceType: serviceType === 'delivery' ? 'Delivery Service' : serviceType === 'single-sign' ? 'Single Sign Placement' : serviceType === 'multiple-signs' ? 'Multiple Signs Placement' : 'Single Location Errand',
      serviceDate: selectedDate,
      timeOption: timeOption === 'anytime' ? 'Anytime (10am-4pm)' : timeOption === 'window' ? `2-Hour Window: ${windowStartTime}` : `Specific Time: ${specificTime}`,
      estimatedDuration: userEstimatedHours === 0.5 ? '30 minutes' : userEstimatedHours === 1 ? '1 hour' : `${userEstimatedHours} hours`,
      pickupLocation: pickupLocation || 'N/A', dropoffLocation: dropoffLocation || 'N/A', errandLocation: errandLocation || 'N/A',
      signCurrentLocation: signCurrentLocation || 'N/A', signDestinationLocation: signDestinationLocation || 'N/A',
      numberOfSigns: serviceType === 'multiple-signs' ? numberOfSigns : 'N/A',
      taskDescription: jobDescription,
      totalMileage: `${pricing.distance.toFixed(1)} miles`, basePrice: `${pricing.basePrice.toFixed(2)}`,
      mileageCost: `${pricing.mileageCost.toFixed(2)}`, timeCost: `${pricing.timeCost.toFixed(2)}`,
      subtotal: `${pricing.subtotal.toFixed(2)}`, serviceFee: `${pricing.markupAmount.toFixed(2)} (${pricing.markupPercent}%)`,
      totalPrice: `${pricing.total.toFixed(2)}`, submissionTime: submissionTime, _subject: 'New Agent Assist Errand Request'
    };
    try {
      const response = await fetch('https://formspree.io/f/movyabey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (response.ok) setOrderSubmitted(true);
      else alert('There was an error submitting your request. Please try again or call us directly.');
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your request. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDowngradeTiming = () => {
    if (timeOption === 'specific') {
      setTimeOption('window');
      if (specificTime) {
        const hour = parseInt(specificTime.split(':')[0]);
        if (hour >= 8 && hour < 10) setWindowStartTime('08:00');
        else if (hour >= 10 && hour < 12) setWindowStartTime('10:00');
        else if (hour >= 12 && hour < 14) setWindowStartTime('12:00');
        else if (hour >= 14 && hour < 16) setWindowStartTime('14:00');
        else if (hour >= 16 && hour < 18) setWindowStartTime('16:00');
        else setWindowStartTime('10:00');
      } else {
        setWindowStartTime('10:00');
      }
    } else if (timeOption === 'window') {
      setTimeOption('anytime');
    }
  };

  const handleBack = () => {
    if (step === 'pricing') {
      setStep('job-details');
    } else if (step === 'job-details') {
      setStep('enter-locations');
      setJobDescription('');
    } else {
      setStep('select-type');
      setServiceType(null);
      setPickupLocation('');
      setDropoffLocation('');
      setErrandLocation('');
      setSignCurrentLocation('');
      setSignDestinationLocation('');
      setPickupCoords(null);
      setDropoffCoords(null);
      setErrandCoords(null);
      setSignCurrentCoords(null);
      setSignDestinationCoords(null);
      setJobDescription('');
      setSelectedDate('');
      setTimeOption('');
      setSpecificTime('');
      setWindowStartTime('');
      setUserEstimatedHours(1);
      setShowSameDayMessage(false);
    }
  };

  const handleContinue = () => {
    setStep('job-details');
  };

  const handleJobDetailsContinue = () => {
    setStep('pricing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Agent Assist</h1>
          <p className="text-sm text-slate-600 mt-1">Professional errand services for real estate agents</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {step === 'select-type' && (
          <div className="space-y-6">
            <button onClick={() => setStep('what-we-do')} className="w-full bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 hover:bg-blue-100 transition-all duration-300 text-left group">
              <div className="flex items-start gap-4">
                <div className="bg-blue-200 rounded-lg p-2 group-hover:bg-blue-300 transition-colors flex-shrink-0 mt-1">
                  <Lightbulb className="w-5 h-5 text-blue-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-blue-900 mb-1">What Can We Do For You?</h3>
                  <p className="text-blue-700 text-sm">See examples of how we can help with your real estate needs</p>
                </div>
              </div>
            </button>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">What do you need?</h2>
              <p className="text-slate-600">Select the type of service</p>
            </div>

            <div className="grid gap-4">
              <button onClick={() => handleServiceSelect('delivery')} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 text-left group">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-xl p-3 group-hover:bg-blue-500 transition-colors">
                    <Package className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Delivery Service</h3>
                    <p className="text-slate-600 text-sm">Pick up and deliver items between two locations</p>
                    <div className="flex items-center gap-2 mt-3 text-blue-600 text-sm font-medium">
                      <span>Select</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>

              <button onClick={() => handleServiceSelect('errand')} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 text-left group">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-xl p-3 group-hover:bg-green-500 transition-colors">
                    <ClipboardList className="w-6 h-6 text-green-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Single Location Errand</h3>
                    <p className="text-slate-600 text-sm">Complete a task at one location</p>
                    <div className="flex items-center gap-2 mt-3 text-green-600 text-sm font-medium">
                      <span>Select</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>

              <button onClick={() => handleServiceSelect('single-sign')} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-500 text-left group">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 rounded-xl p-3 group-hover:bg-orange-500 transition-colors">
                    <svg className="w-6 h-6 text-orange-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.79v2l4-3-4-3v2h-2.04zm-2.96.71h2.79l-2.75-3.54v2h-2.04l4 3-4 3v-2h2.04l2.75-3.54z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Put out a Single Sign</h3>
                    <p className="text-slate-600 text-sm">For putting out or retrieving a single sign like a large For Sale sign in the front yard.</p>
                    <div className="flex items-center gap-2 mt-3 text-orange-600 text-sm font-medium">
                      <span>Select</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>

              <button onClick={() => handleServiceSelect('multiple-signs')} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-red-500 text-left group">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 rounded-xl p-3 group-hover:bg-red-500 transition-colors">
                    <svg className="w-6 h-6 text-red-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.4 14.3l2.81 2.81c.8-.9 1.28-2.08 1.28-3.38 0-2.63-2.05-4.78-4.63-4.93V2h-2v6.02C8.1 8.35 6.3 10.48 6.3 13c0 2.85 2.32 5.15 5.17 5.15 1.3 0 2.49-.48 3.38-1.28l-2.81-2.81.36-.73zM12 17.15c-2.3 0-4.15-1.85-4.15-4.15s1.85-4.15 4.15-4.15 4.15 1.85 4.15 4.15-1.85 4.15-4.15 4.15zm9-7.15c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Put out Multiple Signs</h3>
                    <p className="text-slate-600 text-sm">For putting out or retrieving multiple signs like open house directionals or event signage.</p>
                    <div className="flex items-center gap-2 mt-3 text-red-600 text-sm font-medium">
                      <span>Select</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 'what-we-do' && (
          <div className="space-y-8">
            <button onClick={handleBack} className="text-slate-600 hover:text-slate-900 text-sm font-medium">← Back</button>
            <div className="text-center space-y-4 py-8">
              <h2 className="text-4xl font-bold text-slate-900">We are here to be your extra pair of hands around town.</h2>
              <p className="text-xl text-slate-600">Scroll to see how we can help</p>
            </div>
            <div className="space-y-12">
              <ExampleCard icon="🪧" title="Put Out & Retrieve Signage" description="Get your For Sale signs in the ground or your open house directional signs out before showings? We'll handle placing and retrieving them." action="We'll get them up." color="red" delay={0} />
              <ExampleCard icon="🏠" title="Lights Left On?" description="Buyer's agent left the lights on and your sellers want you to turn them off?" action="We can help." color="blue" delay={200} />
              <ExampleCard icon="🔑" title="Lockbox Check" description="Need someone to verify the lockbox code is working before your showing?" action="We've got it." color="green" delay={400} />
              <ExampleCard icon="🎨" title="Last-Minute Staging Touch" description="Need some last-minute decorations to complete a room before your showing?" action="Consider it done." color="purple" delay={600} />
              <ExampleCard icon="💧" title="Property Check" description="Worried about a potential leak after a storm?" action="We're on it." color="cyan" delay={800} />
              <ExampleCard icon="🎈" title="Last-Minute Supplies" description="Need balloons picked up for an open house that starts in two hours?" action="We can run out." color="pink" delay={1000} />
              <ExampleCard icon="📋" title="Document Delivery" description="Need documents from your office to the title company before they close?" action="We'll rush it over." color="orange" delay={1200} />
              <ExampleCard icon="🔑" title="Key Exchange" description="Need keys delivered from the seller's agent to your buyer?" action="We handle it." color="indigo" delay={1400} />
              <ExampleCard icon="🏡" title="Final Walkthrough Prep" description="Need someone to do a final check and minor touch-ups before the walkthrough?" action="Let us take care of it." color="rose" delay={1600} />
            </div>
            <div className="text-center pt-8">
              <button onClick={() => setStep('select-type')} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl">Request a Runner Now</button>
            </div>
          </div>
        )}

        {step === 'enter-locations' && (
          <div className="space-y-6">
            <button onClick={handleBack} className="text-slate-600 hover:text-slate-900 text-sm font-medium">← Back</button>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{serviceType === 'delivery' ? 'Delivery Details' : serviceType === 'single-sign' || serviceType === 'multiple-signs' ? 'Sign Placement Details' : 'Errand Details'}</h2>
              <p className="text-slate-600">{serviceType === 'delivery' ? 'Enter addresses and scheduling' : serviceType === 'single-sign' || serviceType === 'multiple-signs' ? 'Enter location and scheduling' : 'Enter address and scheduling'}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">When do you need this done?</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Date *</label>
                <input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setTimeOption(''); if (isToday(e.target.value)) { setShowSameDayMessage(true); } else { setShowSameDayMessage(false); } }} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              {showSameDayMessage && (
                <div className="bg-orange-50 border-2 border-orange-400 rounded-xl p-4">
                  <p className="text-orange-800 font-medium">While we may be able to help you, same day selections are not allowed online. Please call us directly at <span className="font-bold">678-780-4623</span> for help with same-day errands.</p>
                </div>
              )}

              {selectedDate && !showSameDayMessage && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Select Time Option *</label>
                  <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer hover:border-blue-400">
                    <input type="radio" name="timeOption" value="anytime" checked={timeOption === 'anytime'} onChange={(e) => setTimeOption(e.target.value)} className="mt-1" />
                    <div className="flex-1">
                      <div className="font-medium">Anytime (10am - 4pm)</div>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Best Price, Most Flexibility</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer hover:border-blue-400">
                    <input type="radio" name="timeOption" value="window" checked={timeOption === 'window'} onChange={(e) => setTimeOption(e.target.value)} className="mt-1" />
                    <div className="flex-1">
                      <div className="font-medium">2-Hour Window</div>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Moderate Price, Moderate Flexibility</p>
                      {timeOption === 'window' && (
                        <select value={windowStartTime} onChange={(e) => setWindowStartTime(e.target.value)} className="mt-3 w-full px-3 py-2 border rounded-lg">
                          <option value="">Select start time...</option>
                          <option value="08:00">8:00 AM - 10:00 AM</option>
                          <option value="10:00">10:00 AM - 12:00 PM</option>
                          <option value="12:00">12:00 PM - 2:00 PM</option>
                          <option value="14:00">2:00 PM - 4:00 PM</option>
                          <option value="16:00">4:00 PM - 6:00 PM</option>
                        </select>
                      )}
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer hover:border-blue-400">
                    <input type="radio" name="timeOption" value="specific" checked={timeOption === 'specific'} onChange={(e) => setTimeOption(e.target.value)} className="mt-1" />
                    <div className="flex-1">
                      <div className="font-medium">Specific Time</div>
                      <p className="text-xs text-green-600 mt-2 font-medium">When time is of the essence</p>
                      {timeOption === 'specific' && (
                        <input type="time" value={specificTime} onChange={(e) => setSpecificTime(e.target.value)} className="mt-3 w-full px-3 py-2 border rounded-lg" />
                      )}
                    </div>
                  </label>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
              {serviceType === 'delivery' ? (
                <>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><MapPin className="w-4 h-4 text-blue-600" /></div>Pickup Location</div></label>
                  <div className="flex gap-2 mb-3">
                    <select value="" onChange={(e) => { if (e.target.value) { setPickupLocation(e.target.value); setPickupCoords({ lat: 34.0489, lon: -84.2938 }); e.target.value = ''; } }} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select preset location...</option>
                      <option value="KW North Atlanta, 925 N Point Parkway, Alpharetta, GA 30005">KW North Atlanta - 925 N Point Parkway, Alpharetta, GA 30005</option>
                    </select>
                  </div>
                  <input type="text" ref={pickupInputRef} value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="Enter pickup address" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><MapPin className="w-4 h-4 text-green-600" /></div>Dropoff Location</div></label>
                  <div className="flex gap-2 mb-3">
                    <select value="" onChange={(e) => { if (e.target.value) { setDropoffLocation(e.target.value); setDropoffCoords({ lat: 34.0489, lon: -84.2938 }); e.target.value = ''; } }} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select preset location...</option>
                      <option value="KW North Atlanta, 925 N Point Parkway, Alpharetta, GA 30005">KW North Atlanta - 925 N Point Parkway, Alpharetta, GA 30005</option>
                    </select>
                  </div>
                  <input type="text" ref={dropoffInputRef} value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} placeholder="Enter dropoff address" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </>
              ) : serviceType === 'single-sign' || serviceType === 'multiple-signs' ? (
                <>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><MapPin className="w-4 h-4 text-orange-600" /></div>{serviceType === 'single-sign' ? "Where is your sign now?" : "Where are your signs now?"}</div></label>
                  <div className="flex gap-2 mb-3">
                    <select value="" onChange={(e) => { if (e.target.value) { setSignCurrentLocation(e.target.value); setSignCurrentCoords({ lat: 34.0489, lon: -84.2938 }); e.target.value = ''; } }} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">Select preset location...</option>
                      <option value="KW North Atlanta, 925 N Point Parkway, Alpharetta, GA 30005">KW North Atlanta - 925 N Point Parkway, Alpharetta, GA 30005</option>
                    </select>
                  </div>
                  <input type="text" ref={errandInputRef} value={signCurrentLocation} onChange={(e) => setSignCurrentLocation(e.target.value)} placeholder="Enter current sign location" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><MapPin className="w-4 h-4 text-orange-600" /></div>Where do you need {serviceType === 'single-sign' ? 'it' : 'them'} to be put out?</div></label>
                  <div className="flex gap-2 mb-3">
                    <select value="" onChange={(e) => { if (e.target.value) { setSignDestinationLocation(e.target.value); setSignDestinationCoords({ lat: 34.0489, lon: -84.2938 }); e.target.value = ''; } }} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">Select preset location...</option>
                      <option value="KW North Atlanta, 925 N Point Parkway, Alpharetta, GA 30005">KW North Atlanta - 925 N Point Parkway, Alpharetta, GA 30005</option>
                    </select>
                  </div>
                  <input type="text" ref={signDestinationInputRef} value={signDestinationLocation} onChange={(e) => setSignDestinationLocation(e.target.value)} placeholder="Enter destination address" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </>
              ) : (
                <div><label className="block text-sm font-medium text-slate-700 mb-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><MapPin className="w-4 h-4 text-green-600" /></div>Errand Location</div></label>
                <div className="flex gap-2 mb-3">
                  <select value="" onChange={(e) => { if (e.target.value) { setErrandLocation(e.target.value); setErrandCoords({ lat: 34.0489, lon: -84.2938 }); e.target.value = ''; } }} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select preset location...</option>
                    <option value="KW North Atlanta, 925 N Point Parkway, Alpharetta, GA 30005">KW North Atlanta - 925 N Point Parkway, Alpharetta, GA 30005</option>
                  </select>
                </div>
                <input type="text" ref={errandInputRef} value={errandLocation} onChange={(e) => setErrandLocation(e.target.value)} placeholder="Enter errand address" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              )}
            </div>

            {serviceType === 'multiple-signs' && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <label className="block text-sm font-medium text-slate-700 mb-4">How many signs? *</label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-orange-600">{numberOfSigns} {numberOfSigns === 1 ? 'sign' : 'signs'}</span>
                  </div>
                  <input type="range" min="1" max="20" step="1" value={numberOfSigns} onChange={(e) => setNumberOfSigns(parseInt(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>1 sign</span>
                    <span>20 signs</span>
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleContinue} disabled={!isLocationFormValid()} className={`w-full py-4 rounded-xl font-semibold text-white ${isLocationFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}>Continue</button>
          </div>
        )}

        {step === 'job-details' && (
          <div className="space-y-6">
            <button onClick={handleBack} className="text-slate-600 hover:text-slate-900 text-sm font-medium">← Back</button>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Job Details</h2>
              <p className="text-slate-600">Review locations and provide task details</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md">
              {pickupCoords || dropoffCoords || errandCoords || signCurrentCoords || signDestinationCoords ? (
                <MapDisplay 
                  pickupCoords={pickupCoords}
                  dropoffCoords={dropoffCoords}
                  errandCoords={errandCoords}
                  signCurrentCoords={signCurrentCoords}
                  signDestinationCoords={signDestinationCoords}
                  serviceType={serviceType}
                />
              ) : (
                <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative flex items-center justify-center">
                  <div className="text-center p-6"><MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" /><p className="text-slate-500">Enter addresses to see map</p></div>
                </div>
              )}
              <div className="mt-4 space-y-2 text-sm">
                {serviceType === 'delivery' ? (
                  <><div><strong>Pickup:</strong> {pickupLocation}</div><div><strong>Dropoff:</strong> {dropoffLocation}</div></>
                ) : serviceType === 'single-sign' || serviceType === 'multiple-signs' ? (
                  <><div><strong>Current Location:</strong> {signCurrentLocation}</div><div><strong>Destination:</strong> {signDestinationLocation}</div>{serviceType === 'multiple-signs' && <div><strong>Number of Signs:</strong> {numberOfSigns}</div>}</>
                ) : (
                  <div><strong>Location:</strong> {errandLocation}</div>
                )}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-amber-900 mb-2">Service Terms</h3>
              <p className="text-xs text-amber-800">Please describe your task in detail. You will be billed for any time involved in waiting, searching, or delays. We reserve the right to refuse errands.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <label className="block text-sm font-medium text-slate-700 mb-2">Task Description *</label>
              <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Describe what needs to be done..." rows="6" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              <p className="text-xs text-slate-500 mt-2">Include instructions, item descriptions, contact info, access codes, etc.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <label className="block text-sm font-medium text-slate-700 mb-4">How long do you estimate this task will take? *</label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-blue-600">{userEstimatedHours === 0.5 ? '30 min' : userEstimatedHours === 1 ? '1 hour' : `${userEstimatedHours} hours`}</span>
                </div>
                <input type="range" min={calculateMinimumTime()} max="8" step="0.5" value={userEstimatedHours} onChange={(e) => setUserEstimatedHours(parseFloat(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{calculateMinimumTime() === 0.5 ? '30 min' : calculateMinimumTime() === 1 ? '1 hour' : `${calculateMinimumTime()} hours`}</span>
                  <span>8 hours</span>
                </div>
                {calculateMinimumTime() > 0.5 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                    <strong>Note:</strong> Minimum time required based on mileage ({calculateTotalMileage().toFixed(1)} miles total)
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleJobDetailsContinue} disabled={!jobDescription.trim() || !userEstimatedHours} className={`w-full py-4 rounded-xl font-semibold text-white ${jobDescription.trim() && userEstimatedHours ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}>Continue to Pricing</button>
          </div>
        )}

        {step === 'pricing' && (
          <div className="space-y-6">
            {!orderSubmitted ? (
              <>
                <button onClick={handleBack} className="text-slate-600 hover:text-slate-900 text-sm font-medium">← Back</button>
                <div><h2 className="text-xl font-semibold text-slate-900 mb-2">Review & Pricing</h2><p className="text-slate-600">Review your order and confirm pricing</p></div>
                <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Service Type:</span><span className="font-medium">{serviceType === 'delivery' ? 'Delivery' : serviceType === 'single-sign' ? 'Single Sign Placement' : serviceType === 'multiple-signs' ? 'Multiple Signs Placement' : 'Single Location Errand'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Date:</span><span className="font-medium">{selectedDate}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Time:</span><span className="font-medium">{timeOption === 'anytime' ? 'Anytime (10am-4pm)' : timeOption === 'window' ? `${windowStartTime} (2hr window)` : timeOption === 'specific' ? specificTime : ''}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Estimated Time:</span><span className="font-medium">{userEstimatedHours === 0.5 ? '30 min' : userEstimatedHours === 1 ? '1 hour' : `${userEstimatedHours} hours`}</span></div>
                    {serviceType === 'multiple-signs' && (<div className="flex justify-between"><span className="text-slate-600">Number of Signs:</span><span className="font-medium">{numberOfSigns}</span></div>)}
                  </div>
                </div>
                {(() => {
                  const pricing = calculatePricing();
                  return (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2"><DollarSign className="w-6 h-6 text-blue-600" /><h3 className="text-xl font-bold text-slate-900">Total Price</h3></div>
                        {timeOption !== 'anytime' && (<button onClick={handleDowngradeTiming} className="text-xs text-blue-600 hover:text-blue-800 underline">Save money with extra flexibility?</button>)}
                      </div>
                      <div className="text-5xl font-bold text-blue-600">${pricing.total.toFixed(2)}</div>
                    </div>
                  );
                })()}
                <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
                  <p className="text-sm text-slate-600">We'll use this to confirm your request</p>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Smith" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label><input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="(555) 123-4567" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label><input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="john@example.com" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                </div>
                <button onClick={handleFormspreeSubmit} disabled={!customerName.trim() || !customerPhone.trim() || !customerEmail.trim() || isSubmitting} className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${customerName.trim() && customerPhone.trim() && customerEmail.trim() && !isSubmitting ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' : 'bg-slate-300 cursor-not-allowed'}`}>{isSubmitting ? 'Submitting...' : 'Accept Price & Submit Request'}</button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center">
                  <div className="text-6xl mb-4">✓</div>
                  <h2 className="text-2xl font-bold text-green-800 mb-4">Your Request Has Been Received!</h2>
                  <div className="bg-white rounded-xl p-6 text-left space-y-3 text-slate-700">
                    <p className="font-medium">What happens next:</p>
                    <ol className="space-y-2 ml-4"><li>1. We will contact you to confirm the details of your request.</li><li>2. Once confirmed, we will take payment by card on file or over the phone if you're a new customer.</li><li>3. A runner will be assigned and you'll receive updates via text or call.</li></ol>
                  </div>
                  <p className="text-sm text-green-700 mt-6">Thank you for choosing Agent Assist!</p>
                </div>
                <button onClick={() => window.location.reload()} className="w-full py-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700">Submit Another Request</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
