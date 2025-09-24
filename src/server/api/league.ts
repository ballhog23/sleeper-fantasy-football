import type { Request, Response } from "express";
import { config } from "../config";
import { NotFoundError } from "../lib/classes/errors";

export async function handlerLeague(_: Request, res: Response) {
	const leagueId = config.league.id;
	const league = await getLeague(leagueId),
		leagueRoster = await getLeagueRosters(leagueId),
		leagueUsers = await getLeagueUsers(leagueId),
		thisWeeksLeaguesMatchups = await getThisWeeksLeagueMatchups(leagueId, 3),
		leagueWinnersBracket = await getLeaguePlayoffBracket(leagueId, "winners_bracket");
	const data = {
		league,
		leagueRoster,
		leagueUsers,
		thisWeeksLeaguesMatchups,
		leagueWinnersBracket
	};

	res.send(data);
}

export async function getLeague(leagueId: string) {
	const url = `https://api.sleeper.app/v1/league/${leagueId}`;
	const league = await fetch(url);

	if (!league)
		throw new NotFoundError(
			"The league was not found. Please make sure your League ID is correct."
		);

	return await league.json();
}

export async function getLeagueRosters(leagueId: string) {
	const url = `https://api.sleeper.app/v1/league/${leagueId}/rosters`;
	const leagueRosters = await fetch(url);

	if (!leagueRosters)
		throw new NotFoundError(
			`No rosters were found for League ID: ${leagueId}. Please make sure your League ID is correct.`
		);

	return await leagueRosters.json();
}

export async function getLeagueUsers(leagueId: string) {
	const url = `https://api.sleeper.app/v1/league/${leagueId}/users`;
	const leagueUsers = await fetch(url);

	if (!leagueUsers)
		throw new NotFoundError(
			`No users were found for League ID: ${leagueId}. Please make sure your League ID is correct.`
		);

	return await leagueUsers.json();
}

export async function getThisWeeksLeagueMatchups(leagueId: string, week: number) {
	const url = `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`;
	const leagueMatchups = await fetch(url);

	if (!leagueMatchups)
		throw new NotFoundError(
			`No league matchups were found for League ID: ${leagueId}. Please make sure your League ID is correct.`
		);

	return await leagueMatchups.json();
}

// attempted loses_bracket, currently resulting in a 404, try again in the future
export async function getLeaguePlayoffBracket(leagueId: string, bracket: 'winners_bracket'|'loses_bracket') {
	const url = `https://api.sleeper.app/v1/league/${leagueId}/${bracket}`;
	const playoffBracket = await fetch(url);

	if (!playoffBracket)
		throw new NotFoundError(
			`No playoff brackets were found for League ID: ${leagueId}. Please make sure your League ID is correct.`
		);

	return await playoffBracket.json();
}