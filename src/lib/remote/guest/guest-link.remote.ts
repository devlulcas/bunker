import { command, form, query } from '$app/server';
import { requireAdmin } from '$lib/server/auth/require-permission';
import {
	createGuestLink,
	deleteGuestLink,
	getAllGuestLinks
} from '$lib/server/guest/guest-management';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getGuestLinksAction = query(async () => {
	try {
		const links = await getAllGuestLinks();
		return { links };
	} catch (error) {
		console.error('Failed to get guest links:', error);
		return { error: 'Failed to get guest links' };
	}
});

export const createGuestLinkAction = form(async (data) => {
	const admin = requireAdmin();

	const username = data.get('username');
	const allowedPages = data.getAll('allowedPages');
	const durationHours = data.get('durationHours');

	if (typeof username !== 'string') {
		error(400, 'O nome de usuário deve ser uma string');
	}

	if (!Array.isArray(allowedPages) || allowedPages.length === 0) {
		error(400, 'As páginas permitidas devem ser um array não vazio');
	}

	if (allowedPages.some((page) => typeof page !== 'string')) {
		error(400, 'As páginas permitidas devem ser um array de strings');
	}

	if (typeof durationHours !== 'number' || durationHours < 1 || durationHours > 8760) {
		error(400, 'A duração deve ser um número entre 1 e 8760');
	}

	try {
		const guestLink = await createGuestLink(
			{
				username,
				allowedPages: allowedPages as string[],
				durationHours
			},
			admin
		);

		await getGuestLinksAction().refresh();

		return { guestLink };
	} catch (err) {
		console.error('Failed to create guest link:', err);
		error(500, 'Erro ao criar o link de acesso');
	}
});

export const deleteGuestLinkAction = command(v.string(), async (id) => {
	requireAdmin();

	if (!id) {
		error(400, 'ID do link de acesso é obrigatório');
	}

	try {
		await deleteGuestLink(id);
		await getGuestLinksAction().refresh();

		return { success: true };
	} catch (err) {
		console.error('Failed to delete guest link:', err);
		error(500, 'Erro ao deletar o link de acesso');
	}
});
