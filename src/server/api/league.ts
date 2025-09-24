import type { Request, Response } from 'express';
import { config } from '../config';
import { NotFoundError } from '../lib/classes/errors';

export async function handlerLeague(_: Request, res: Response) {
	const league = await getLeague();

	if (!league)
		throw new NotFoundError(
			'The league was not found. Please make sure your League ID is correct.'
		);

	res.send(league);
}

export async function getLeague() {
	const leagueId = config.league.id;
	const url = `https://api.sleeper.app/v1/league/${leagueId}`;
	const fetchLeague = await fetch(url);
	const theLeague = await fetchLeague.json();

	return theLeague;
}
