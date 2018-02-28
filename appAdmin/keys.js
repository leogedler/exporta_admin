var ParseServer = false;
var apiUrl;

// Exportatucarro 
Parse.initialize("exportatucarroApp", "unused");
apiUrl = 'http://52.39.0.23/backend';
Parse.serverURL = apiUrl;

/* Global variables */
var mCurrentUser = Parse.User.current();
var mCountries = [
		"Afganistán", "Islas de Aland", "Albania", "Argelia", "American Samoa", "Andorra", "Angola",
		"Anguila", "Antártida", "Antigua y Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria",
		"Azerbaiyán", "Bahamas", "Bahrein", "Bangladesh", "Barbados", "Bielorrusia", "Bélgica", "Belice", "Benin",
		"Bermudas", "Bhutan", "Bolivia, Estado Plurinacional de", "Bonaire, Sint Eustatius y Saba", "Bosnia y Herzegovina",
		"Botswana", "Isla Bouvet", "Brasil",
		"Territorio Británico del Océano Índico", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Camboya",
		"Camerún", "Canadá", "Cabo Verde", "Islas Caimán", "República Centroafricana", "Chad", "Chile", "China",
		"Isla de Navidad", "Islas Cocos (Keeling) Islas", "Colombia", "Comoras", "Congo",
		"Congo, la República Democrática del", "Islas Cook", "Costa Rica", "Costa de Marfil", "Croacia", "Cuba",
		"Chipre", "República Checa", "Dinamarca", "Djibouti", "Dominica", "República Dominicana", "Ecuador", "Egipto",
		"El Salvador", "Guinea Ecuatorial", "Eritrea", "Estonia", "Etiopía", "Islas Malvinas (Falkland Islands)",
		"Islas Feroe", "Fiji", "Finlandia", "Francia", "Guayana", "Polinesia Francesa",
		"Territorios Franceses del Sur", "Gabón", "Gambia", "Georgia", "Alemania", "Ghana", "Gibraltar", "Grecia",
		"Groenlandia", "Granada", "Guadalupe", "Guam", "Guatemala", "Guernsey", "Guinea",
		"Guinea-Bissau", "Guyana", "Haití", "Islas Heard y McDonald", "Santa Sede (Ciudad del Vaticano)",
		"Honduras", "Hong Kong", "Hungría", "Islandia", "India", "Indonesia", "Irán, República Islámica de", "Irak",
		"Irlanda", "Isla de Man", "Israel", "Italia", "Jamaica", "Japón", "Jersey", "Jordan", "Kazajstán", "Kenia",
		"Kiribati", "Corea, República Popular Democrática de", "Corea del Sur", "Kuwait", "Kirguistán",
		"La República Democrática Popular de Laos", "Letonia", "Líbano", "Lesotho", "Liberia", "Libia",
		"Liechtenstein", "Lituania", "Luxemburgo", "Macao", "Macedonia, Ex-República Yugoslava de",
		"Madagascar", "Malaui", "Malasia", "Maldivas", "Mali", "Malta", "Islas Marshall", "Martinica",
		"Mauritania", "Mauricio", "Mayotte", "México", "Micronesia, Estados Federados de", "República de Moldova",
		"Mónaco", "Mongolia", "Montenegro", "Montserrat", "Marruecos", "Mozambique", "Myanmar", "Namibia", "Nauru",
		"Nepal", "Países Bajos", "Nueva Caledonia", "Nueva Zelanda", "Nicaragua", "Níger",
		"Nigeria", "Niue", "Isla de Norfolk", "Islas Marianas del Norte", "Noruega", "Omán", "Pakistán", "Palau",
		"Palestina, Territorio Ocupado", "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Filipinas",
		"Pitcairn", "Polonia", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Rumania", "Federación de Rusia",
		"Ruanda", "San Bartolomé", "Santa Elena, Ascensión y Tristán da Cunha", "San Cristóbal y Nieves", "Santa Lucía",
		"San Martín (parte francesa)", "San Pedro y Miquelón", "San Vicente y las Granadinas", "Samoa", "San Marino",
		"Santo Tomé y Príncipe", "Arabia Saudita", "Senegal", "Serbia", "Seychelles", "Sierra Leona", "Singapur",
		"Sint Maarten (neerlandés Parte)", "Eslovaquia", "Eslovenia", "Islas Salomón", "Somalia", "Sudáfrica",
		"Georgia del Sur e Islas Sandwich del Sur", "Sudán del Sur", "España", "Sri Lanka", "Sudán", "Suriname",
		"Svalbard y Jan Mayen", "Swazilandia", "Suecia", "Suiza", "República Árabe Siria",
		"Taiwán, Provincia de China", "Tayikistán", "Tanzania, República Unida de", "Tailandia", "Timor-Leste",
		"Togo", "Tokelau", "Tonga", "Trinidad y Tobago", "Túnez", "Turquía", "Turkmenistán",
		"Islas Turcas y Caicos", "Tuvalu", "Uganda", "Ucrania", "Emiratos Árabes Unidos", "Reino Unido",
		"Estados Unidos", "Estados Unidos Islas menores alejadas", "Uruguay", "Uzbekistán", "Vanuatu",
		"Venezuela", "Viet Nam", "Islas Vírgenes Británicas", "Islas Vírgenes, EE.UU.",
		"Wallis y Futuna", "Sahara Occidental", "Yemen", "Zambia", "Zimbabwe"
	];


var mGetHeaderJson = {
	'X-Parse-Application-Id':'exportatucarroApp',
	'Content-Type': 'application/json'
};

var mPostPutHeaderJson = {
	'X-Parse-Application-Id':'exportatucarroApp',
	'Content-Type': 'application/json'
};

var mPostImageHeaderJson = {
	'X-Parse-Application-Id':'exportatucarroApp',
	'Content-Type': 'image/jpeg'
};


var mUpdateUserHeaderJson;
if (mCurrentUser != null) {
	mUpdateUserHeaderJson = {
		'X-Parse-Application-Id':'exportatucarroApp', 
		'X-Parse-Master-Key' : 'exportatucarroApp2016', 
		'Content-Type': 'application/json'
	}
};





