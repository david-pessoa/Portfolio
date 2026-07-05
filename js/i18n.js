import { loadProjectPage } from '../projetos/project.js';
import { loadProjectsList, loadCertificatesList } from './loadLists.js';
import { changeLanguageListOrder} from './main.js'

async function i18nextInit() {
	await i18next
		.use(i18nextHttpBackend)
		.use(i18nextBrowserLanguageDetector)
		.init({
			fallbackLng: 'en', // se não achar, usa inglês
			supportedLngs: ['en', 'pt-BR'], // línguas suportadas
			ns: ['translation'],
			defaultNS: 'translation',
			backend: {
				loadPath: '../locales/{{ lng }}/translation.json',
			},
			debug: true,
		});
	updateContent();
}

export function getCurrentLanguage() {
  return i18next.resolvedLanguage || i18next.language;
}

function updateContent() {
	const elements = document.querySelectorAll('[data-i18n]');
	elements.forEach((el) => {
		const key = el.getAttribute('data-i18n');
		el.innerHTML = i18next.t(key);
	});
	changeLanguageListOrder()
}

i18next.on('languageChanged', () => {
	loadProjectsList();
	loadCertificatesList();
	loadProjectPage();
});

export async function changeLanguage(lng) {
	await i18next.changeLanguage(lng);
	updateContent();
}

window.changeLanguage = changeLanguage;

i18nextInit();
