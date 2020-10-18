var max_slns = 40;
var unit = { w: 150, h: 100 };
var links = [];
var room_types = [
	{name: "Bedroom", target_area: 0.2},
	{name: "Living", target_area: 0.25},
	{name: "Closet", target_area: 0.1},

	{name: "Kitchen", target_area: 0.3},
	{name: "Bathroom", target_area: 0.15}
];

function init_links()
{
	for (var y in room_types)
	{
		var row = [];
		for (var x in room_types)
		{
			row.push(false);
		}
		links.push(row);
	}
}

function get_room_by_name(name)
{
	for (var room_type in room_types)
	{
		if (room_types[room_type].name == name)
			return room_type;
	}
	console.error("Room not found.", name);
}

function link_rooms(room0, room1)
{
	var id0 = get_room_by_name(room0);
	var id1 = get_room_by_name(room1);
	links[id0][id1] = true;
	links[id1][id0] = true;
}

function rand_range(min, max)
{
	return Math.floor(Math.random() * (max - min) + min);
}

function rand_bool()
{
	return Math.random() >= 0.5;
}

function node_random(depth)
{
	var node = {};

	node.horizontal = rand_bool();
	node.cut = Math.random();
	node.children = [];
	node.type = rand_range(0, room_types.length);

	if (depth > 0)
	{
		if (Math.random() < 0.25)
		{
			node.children.push(node_random(depth - 1));
			node.children.push(node_random(depth - 1));
		}
	}

	return node;
}

function sln_random()
{
	var sln = {};
	sln.node = node_random(3);
		
	sln.fitness = -Infinity;
	return sln;
}

function node_copy(node)
{
	var copy = { children: [] };
	copy.horizontal = node.horizontal;
	copy.type = node.type;
	copy.cut = node.cut;
	if (node.children.length > 0)
	{
		copy.children.push(node_copy(node.children[0]));
		copy.children.push(node_copy(node.children[1]));
	}
	return copy;
}

function node_mix(a, b)
{
	var nodes = [{ children: [] }, { children: [] }];
	if (Math.random() < 0.20)
	{
		var tmp = b;
		b = a;
		a = b;
	}

	nodes[0].cut = a.cut;
	nodes[1].cut = b.cut;

	if (a.children.length > 0 && b.children.length > 0)
	{
		nodes[0].children = node_mix(a.children[0], b.children[0]);
		nodes[1].children = node_mix(a.children[1], b.children[1]);
	}
	else if (a.children.length > 0)
	{
		nodes[0].children = node_copy(a.children[0]);
		nodes[1].children = node_copy(a.children[1]);
	}
	else if (b.children.length > 0)
	{
		nodes[0].children = node_copy(b.children[0]);
		nodes[1].children = node_copy(b.children[1]);
	}

	var percent = Math.random();
	nodes[0].cut = a.cut * percent + b.cut * (1.0 - percent);
	nodes[1].cut = b.cut * percent + a.cut * (1.0 - percent);
	nodes[0].type = a.type;
	nodes[1].type = b.type;
	return nodes;
}

function node_mutate(node, leaf_mutation_odds, node_mutation_odds, node_split_odds)
{
	if (node.children.length > 0)
	{
		node_mutate(node.children[0], leaf_mutation_odds,
			node_mutation_odds, node_split_odds);
		node_mutate(node.children[1], leaf_mutation_odds,
			node_mutation_odds, node_split_odds);
		if (Math.random() < node_mutation_odds)
		{
			switch (rand_range(0, 3))
			{
				case 0:
					var increment = rand_bool() ? 0.1 : -0.1;
					node.cut = Math.min(Math.max(node.cut + increment, 0.1), 0.9);
				break;
				case 1:
					if (node.children.length > 0)
					{
						var tmp = node.children[0];
						node.children[0] = node.children[1];
						node.children[1] = tmp;
					}
				break;
				case 2:
					node.horizontal = !node.horizontal;
				break;
			}
		}
	}
	else
	{
		var rand = Math.random();
		if (rand < leaf_mutation_odds)
		{
			if (rand < leaf_mutation_odds * node_split_odds)
			{
				node.cut = Math.random();
				node.horizontal = rand_bool();
				node.children.push(node_random(0));
				node.children.push(node_random(0));
			}
			else
			{
				node.type = rand_range(0, room_types.length);
			}
		}
	}
}

function grid_cut_horizontal(grid, cut)
{
	var widths = grid.widths;
	var wcursor = 0.0;
	for (var i = 0; i < widths.length; ++i)
	{
		if (cut > wcursor && cut < wcursor + widths[i])
		{
			var new_w = cut - wcursor;
			var new_remaining = wcursor + widths[i] - cut;
			widths[i] = new_w;
			widths.splice(i + 1, 0, new_remaining);
			break;
		}
		wcursor += widths[i];
	}
}

function grid_cut_vertical(grid, cut)
{
	var heights = grid.heights;
	var hcursor = 0.0;
	for (var i = 0; i < heights.length; ++i)
	{
		if (cut > hcursor && cut < hcursor + heights[i])
		{
			var new_h = cut - hcursor;
			var new_remaining = hcursor + heights[i] - cut;
			heights[i] = new_h;
			heights.splice(i + 1, 0, new_remaining);
			break;
		}
		hcursor += heights[i];
	}
}


function node_to_grid(node, grid, x, y, width, height)
{
	if (node.children.length > 0)
	{
		var awidth, aheight, bwidth, bheight;
		var ax, ay, bx, by;
		if (node.horizontal)
		{
			awidth = width * node.cut;
			aheight = height;
			ax = x;
			ay = y;
			bwidth = width * (1.0 - node.cut);
			bheight = height;
			bx = x + awidth;
			by = y;
			grid_cut_horizontal(grid, x + node.cut * width);
		}
		else
		{
			awidth = width;
			aheight = height * node.cut;
			ax = x;
			ay = y;
			bwidth = width;
			bheight = height * (1.0 - node.cut);
			bx = x;
			by = y + aheight;
			grid_cut_vertical(grid, y + node.cut * height);
		}
		node_to_grid(node.children[0], grid, ax, ay, awidth, aheight);
		node_to_grid(node.children[1], grid, bx, by, bwidth, bheight);
	}
}

function paint_grid(grid, x, y, width, height, type)
{
	var wcursor = 0.0;
	var windex = 0;
	for (; windex < grid.widths.length; ++windex)
	{
		if (Math.abs(x - wcursor) < 0.001)
		{
			break;
		}
		wcursor = wcursor + grid.widths[windex];
	}
	if (windex == grid.widths.length)
	{
		console.error("failed to find grid cell X");
	}

	var hcursor = 0.0;
	var hindex = 0;
	for (; hindex < grid.heights.length; ++hindex)
	{
		if (Math.abs(y - hcursor) < 0.001)
		{
			break;
		}
		hcursor = hcursor + grid.heights[hindex];
	}
	if (hindex == grid.heights.length)
		console.error("failed to find grid cell Y");

	hcursor = 0.0;
	for (var i = hindex; i < grid.heights.length; ++i)
	{
		wcursor = 0.0;
		for (var j = windex; j < grid.widths.length; ++j)
		{
			grid.points[i][j][0] = type;
			wcursor += grid.widths[j];
			if (Math.abs(width - wcursor) < 0.001)
				break;
		}

		hcursor += grid.heights[i];
		if (Math.abs(height - hcursor) < 0.001)
			break;
	}
}

function node_paint_grid(node, grid, x, y, width, height)
{
	if (node.children.length > 0)
	{
		var awidth, aheight, bwidth, bheight;
		var ax, ay, bx, by;
		if (node.horizontal)
		{
			awidth = width * node.cut;
			aheight = height;
			ax = x;
			ay = y;
			bwidth = width * (1.0 - node.cut);
			bheight = height;
			bx = x + awidth;
			by = y;
		}
		else
		{
			awidth = width;
			aheight = height * node.cut;
			ax = x;
			ay = y;
			bwidth = width;
			bheight = height * (1.0 - node.cut);
			bx = x;
			by = y + aheight;
		}
		node_paint_grid(node.children[0], grid, ax, ay, awidth, aheight);
		node_paint_grid(node.children[1], grid, bx, by, bwidth, bheight);
	} else {
		paint_grid(grid, x, y, width, height, node.type);
	}
}

function sln_copy(sln)
{
	var copy = {};
	copy.fitness = -Infinity;
	copy.node = node_copy(sln.node);
	return copy;
}

function sln_mix(a, b)
{
	var slns = [{}, {}];
	var nodes = node_mix(a.node, b.node);
	slns[0].fitness = -Infinity;
	slns[1].fitness = -Infinity;
	slns[0].node = nodes[0];
	slns[1].node = nodes[1];
	return slns;
}

function sln_mutate(sln)
{
	var target_mutations = rand_range(0, 20);
	var count = node_count(sln.node);
	for (var i = 0; i < target_mutations; i++)
		node_mutate(sln.node, 0.2, 0.1, 0.1);
}

function grid_reserve(grid)
{
	grid.points = [];
	for (var i = 0; i < grid.heights.length; ++i)
	{
		grid.points.push([]);
		for (var j = 0; j < grid.widths.length; ++j)
		{
			grid.points[i].push([-1, -1]);
		}
	}
}

function node_count(node)
{
	if (node.children.length > 0)
	{
		var count = 1;
		count += node_count(node.children[0]);
		count += node_count(node.children[1]);
		return count;
	}
	return 1;
}

function grid_check(grid)
{
	var error = false;
	if (grid.heights.length > 100)
	{
		console.error("too many rows", grid, grid.heights.length);
		error = true;
	}
	if (grid.widths.length > 100)
	{
		console.error("too many cols", grid, grid.widths.length);
		error = true;
	}

	if (grid.points)
	{
		for (var i = 0; i < grid.heights.length; ++i)
		{
			for (var j = 0; j < grid.widths.length; ++j)
			{
				var value = grid.points[i][j][0];
				if (value == -1 || value == undefined)
				{
					console.error("failed to paint at", grid, j, i);
					error = true;
				}
				if (value >= room_types.length)
				{
					console.error("room type invalid", value);
					error = true;
				}

			}
		}
	}
	return error;
}

function grid_print(grid, sln)
{
	var str = "";
	for (var i = 0; i < grid.heights.length; ++i)
	{
		for (var j = 0; j < grid.widths.length; ++j)
		{
			str += " " + grid.points[i][j][0];
		}
		str += "\n";
	}
	console.log(str);
}

function grid_value(grid, y, x)
{
	if (   x >= grid.widths.length 
	    || y >= grid.heights.length
	    || x < 0
	    || y < 0)
		return [-1, -1];
	else
		return grid.points[y][x];
}

var g_evaluation_id = 0;
function grid_flood_fill(grid, room_type, y, x, neighborhoods, bounds)
{
	var area = 0.0;
	var cell = grid_value(grid, y, x);
	if (cell[1] == g_evaluation_id || cell[0] == -1)
		return area;
	cell[1] = g_evaluation_id;

	if (cell[0] != room_type)
	{
		neighborhoods[cell[0]] = true;
		return area;
	}

	bounds.minx = Math.min(bounds.minx, x);
	bounds.miny = Math.min(bounds.miny, y);
	bounds.maxx = Math.max(bounds.maxx, x);
	bounds.maxy = Math.max(bounds.maxy, y);

	area += grid.widths[x] * grid.heights[y];

	area += grid_flood_fill(grid, room_type, y - 1, x, neighborhoods, bounds);
	area += grid_flood_fill(grid, room_type, y + 1, x, neighborhoods, bounds);
	area += grid_flood_fill(grid, room_type, y, x - 1, neighborhoods, bounds);
	area += grid_flood_fill(grid, room_type, y, x + 1, neighborhoods, bounds);

	return area;
}

function grid_point_evaluate(grid, x, y, room_type, debug)
{
	var score = 0;
	var bounds = {
		minx: Infinity,
		miny: Infinity,
		maxx: -Infinity,
		maxy: -Infinity
	};
	var neighborhoods = [];
	for (var i = 0; i < room_types.length; ++i)
	{
		neighborhoods.push(false);
	}
	var area = grid_flood_fill(grid, room_type, y, x, neighborhoods,
		bounds);
	var target_area = room_types[room_type].target_area * unit.w * unit.h;
	score -= Math.abs(target_area - area);

	for (var i = 0; i < room_types.length; ++i)
	{
		if (links[room_type][i])
		{
			if (!neighborhoods[i])
			{
				if (debug)
					console.log("missing link", room_types[room_type].name,
						room_types[i].name);
				score -= 500;
			}
		}
	}
	return score;
}

function room_evaluate(grid, room_type, debug)
{
	var score = 0.0;
	var count = 0;

	for (var y = 0; y < grid.heights.length; ++y)
	{
		for (var x = 0; x < grid.widths.length; ++x)
		{
			var cell = grid.points[y][x];
			if (cell[0] == room_type && cell[1] != g_evaluation_id)
			{
				count++;
				if (count == 1)
				{
					score += grid_point_evaluate(grid, x, y, room_type, debug);
				}
				if (count > 1)
					break;
			}
		}
	}

	if (count != 1)
	{
		if (debug && count > 1)
			console.log("disconnected", room_types[room_type].name);
		else if (debug)
			console.log("missing", room_types[room_type].name);
		score -= 1000.0;
	}
	return score;
}

function sln_evaluate(sln, debug)
{
	var areas = [];
	var grid = { widths: [unit.w], heights: [unit.h]};
	node_to_grid(sln.node, grid, 0, 0, unit.w, unit.h);
	if (grid_check(grid))
	{
		sln.fitness = -Infinity;
		return {widths:[unit.w], heights:[unit.h], points: [[0, -1]]};
	}

	grid_reserve(grid);
	node_paint_grid(sln.node, grid, 0, 0, unit.w, unit.h);

	var score = 0.0;
	for (var room_type in room_types)
	{
		score += room_evaluate(grid, room_type, debug);
		g_evaluation_id++;
	}

	sln.fitness = score;
	return grid;
}

function population_random()
{
	var slns = [];
	for (var i = 0; i < max_slns; ++i)
	{
		slns.push(sln_random());
	}
	return slns;
}

function population_update(slns)
{
	var improved = false;
	var last_best = slns[0].fitness;
	var chunk = max_slns / 4;
	var winners = { start: 0, end: chunk };
	var reset = { start: chunk * 2, end: chunk * 3};
	var dead = { start: chunk * 3, end: max_slns};

	var losers = { start: winners.start, end: max_slns / 3};
	for (var sln in slns)
	{
		sln_evaluate(slns[sln], false);
	}

	slns.sort(function (a, b) {
		return b.fitness - a.fitness;
	});

	if (slns[0].fitness > last_best)
	{
		last_best = slns[0].fitness;
		improved = true;
		console.log(last_best);
	}
	for (var i = 0; i < winners.end; ++i)
	{
		var child = sln_copy(slns[i]);
		sln_mutate(child);
		slns[dead.start + i] = child;
	}
	for (var i = reset.start; i < reset.end; ++i)
	{
		slns[i] = sln_random();
	}
	return improved;
}

function grid_flood_fill_points(grid, room_type, y, x, points)
{
	var cell = grid_value(grid, y, x);
	if (cell[1] == g_evaluation_id || cell[0] != room_type)
		return;
	cell[1] = g_evaluation_id;

	points.push([x, y]);

	grid_flood_fill_points(grid, room_type, y - 1, x, points);
	grid_flood_fill_points(grid, room_type, y + 1, x, points);
	grid_flood_fill_points(grid, room_type, y, x - 1, points);
	grid_flood_fill_points(grid, room_type, y, x + 1, points);
}

function grid_point_rect(grid, x, y)
{
	var wcursor = 0.0;
	var hcursor = 0.0;
	for (var i = 0; i < x && i < grid.widths.length; ++i)
	{
		wcursor += grid.widths[i];
	}
	for (var i = 0; i < y && i < grid.heights.length; ++i)
	{
		hcursor += grid.heights[i];
	}
	return {x: wcursor, y: hcursor, w: grid.widths[x], h: grid.heights[y]};
}

function grid_point_coords(grid, x, y, room_type)
{
	var points = [];
	g_evaluation_id++;
	grid_flood_fill_points(grid, room_type, y, x, points);

	var edges = [];
	for (var p in points)
	{
		var x = points[p][0];
		var y = points[p][1];
		var rect = grid_point_rect(grid, x, y);
		if (grid_value(grid, y - 1, x)[0] != room_type)
		{
			var e0 = {x: rect.x, y: rect.y};
			var e1 = {x: rect.x + rect.w, y: rect.y};
			edges.push([e0, e1]);
		}
		if (grid_value(grid, y, x + 1)[0] != room_type)
		{
			var e0 = {x: rect.x + rect.w, y: rect.y};
			var e1 = {x: rect.x + rect.w, y: rect.y + rect.h};
			edges.push([e0, e1]);
		}
		if (grid_value(grid, y + 1, x)[0] != room_type)
		{
			var e0 = {x: rect.x + rect.w, y: rect.y + rect.h};
			var e1 = {x: rect.x, y: rect.y + rect.h};
			edges.push([e0, e1]);
		}
		if (grid_value(grid, y, x - 1)[0] != room_type)
		{
			var e0 = {x: rect.x, y: rect.y + rect.h};
			var e1 = {x: rect.x, y: rect.y};
			edges.push([e0, e1]);
		}
	}
	if (edges.length == 0)
		return [];

	var coords = edges.pop();
	while (edges.length > 0)
	{
		var start_edges = edges.length;
		var end = coords[coords.length - 1];

		for (var i = 0; i < edges.length; ++i)
		{
			var start = edges[i][0];
			if (   Math.abs(end.x - start.x) < 0.001
				&& Math.abs(end.y - start.y) < 0.001)
			{
				coords.push(edges[i][1]);
				edges.splice(i, 1);
				break;
			}
		}
		if (start_edges == edges.length)
		{
			console.error("edges not empty, but not connectable", edges);
			break;
		}
	}

	if (   Math.abs(coords[coords.length - 1].x - coords[0].x) < 0.001
	    && Math.abs(coords[coords.length - 1].y - coords[0].y) < 0.001)
		coords.pop();

	return coords;
}

function room_feature(grid, room_type)
{
	var feature = {};
	feature.label = room_types[room_type].name;
	feature.coords = [];
	var count = 0;

	for (var y = 0; y < grid.heights.length; ++y)
	{
		for (var x = 0; x < grid.widths.length; ++x)
		{
			var cell = grid.points[y][x];
			if (cell[0] == room_type && cell[1] != g_evaluation_id)
			{
				count++;
				if (count == 1)
				{
					feature.coords = grid_point_coords(grid, x, y,
						room_type);
				}
				if (count > 1)
					break;
			}
		}
	}
	return feature;
}

function grid_features(grid)
{
	if (grid_check(grid))
	{
		return [];
	}
	var features = [];
	for (var room_type in room_types)
	{
		var feature = room_feature(grid, room_type);
		if (feature.coords.length > 0)
			features.push(feature);
	}
	return features;
}

export const calculatePrimes = (iterations, multiplier) => {
	init_links()
	link_rooms("Living", "Bedroom");
	link_rooms("Bathroom", "Kitchen");
	link_rooms("Kitchen", "Living");
	link_rooms("Closet", "Bedroom");

	var slns = population_random();
	var time_since_last_improvement = 0;

	var id = setInterval(function(){
		var improved = false;
		for (var i = 0; i < 100; ++i) {
			if (population_update(slns))
				improved = true;
		}
		if (!improved)
		{
			time_since_last_improvement += 200;
		}
		else
		{
			var result = grid_features(sln_evaluate(slns[0], true));
			time_since_last_improvement = 0;
			postMessage(result);
		}
		if (time_since_last_improvement > 8000)
		{
			console.log("ending");
			postMessage({end:true});
			clearInterval(id);
		}
	}, 500);
}
