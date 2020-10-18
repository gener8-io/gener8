
var max_slns = 120;
var unit = { w: 100, h: 200 };
var links = [];
var room_types = [
	{name: "Bedroom", target_area: 0.2},
	{name: "Living", target_area: 0.2},
	{name: "Closet", target_area: 0.1},

	{name: "Kitchen", target_area: 0.3},
	{name: "Bathroom", target_area: 0.2}
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
	return Math.random() * (max - min) + min;
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
	node.type = Math.round(rand_range(0, room_types.length));

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
	sln.node = node_random(4);
	sln.fitness = -Infinity;
	return sln;
}

function node_copy(node)
{
	var copy = { children: [] };
	copy.horizontal = node.horizontal;
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
	return nodes;
}

function node_mutate(node, leaf_mutation_odds, node_mutation_odds)
{
	if (node.children.length > 0)
	{
		node_mutate(node.children[0], leaf_mutation_odds, node_mutation_odds);
		node_mutate(node.children[1], leaf_mutation_odds, node_mutation_odds);
		if (Math.random() < node_mutation_odds)
		{
			switch (rand_range(0, 4))
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
				case 3:
					if (node.children.length == 0)
					{
						node.cut = Math.random();
						node.horizontal = rand_bool();
						node.children.push(node_random(0));
						node.children.push(node_random(0));
					}
				break;
			}
		}
	}
	else
	{
		if (Math.random() < leaf_mutation_odds)
		{

			switch (rand_range(0, 2))
			{
				case 0:
					if (node.children.length == 0)
					{
						node.cut = Math.random();
						node.horizontal = rand_bool();
						node.children.push(node_random(0));
						node.children.push(node_random(0));
					}
				break;
				case 1:
					node.type = Math.round(rand_range(0, room_types.length));
				break;
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
			wcursor += grid.widths[j];
			grid.points[i][j][0] = type;
			if (Math.abs(wcursor - wcursor) < 0.001)
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
	var target_mutations = Math.round(rand_range(0, 100));
	for (var i = 0; i < target_mutations; i++)
		node_mutate(sln.node, 0.2, 0.1);
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

var g_evaluation_id = 0;
function grid_flood_fill(grid, room_type, yi, xi, neighborhoods, bounds)
{
	var area = 0.0;
	if (   xi >= grid.widths.length 
	    || yi >= grid.heights.length
	    || xi < 0
	    || yi < 0)
		return area;

	var cell = grid.points[yi][xi];

	if (cell[1] == g_evaluation_id || cell[0] == -1)
		return area;
	cell[1] = g_evaluation_id;

	if (cell[0] != room_type)
	{
		neighborhoods[cell[0]] = true;
		return area;
	}

	bounds.minx = Math.min(bounds.minx, xi);
	bounds.miny = Math.min(bounds.miny, yi);
	bounds.maxx = Math.max(bounds.maxx, xi);
	bounds.maxy = Math.max(bounds.maxy, yi);

	area += grid.widths[xi] * grid.heights[yi];

	area += grid_flood_fill(grid, room_type, yi - 1, xi, neighborhoods, bounds);
	area += grid_flood_fill(grid, room_type, yi + 1, xi, neighborhoods, bounds);
	area += grid_flood_fill(grid, room_type, yi, xi - 1, neighborhoods, bounds);
	area += grid_flood_fill(grid, room_type, yi, xi + 1, neighborhoods, bounds);

	return area;
}

function evaluate_room(grid, room_type, debug)
{
	var score = 0.0;
	var count = 0;
	var xi, yi;

	for (var y = 0; y < grid.heights.length; ++y)
	{
		for (var x = 0; x < grid.widths.length; ++x)
		{
			var type = grid.points[y][x][0];
			if (type == room_type)
			{
				count++;
				if (count == 1)
				{
					xi = x;
					yi = y;
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
	if (count > 0)
	{
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
		var area = grid_flood_fill(grid, room_type, yi, xi, neighborhoods,
			bounds);
		var target_area = room_types[room_type].target_area * unit.w * unit.h;
		if (debug)
			console.log("area penalty", room_types[room_type].name,
				area, target_area);
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
	}
	return score;
}

function sln_evaluate(sln, debug)
{
	var areas = [];
	var w = 100;
	var h = 200;
	grid = { widths: [w], heights: [h]};
	node_to_grid(sln.node, grid, 0, 0, w, h);
	grid_reserve(grid);
	node_paint_grid(sln.node, grid, 0, 0, w, h);

	var score = 0.0;
	for (var room_type in room_types)
	{
		score += evaluate_room(grid, room_type, debug);
		g_evaluation_id++;
	}

	sln.fitness = score;
	return grid;
}

function population_random()
{
	slns = [];
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
	for (var i = 0; i < winners.end; i += 2)
	{
		var p = slns[i];
		var m = slns[i + 1];
		var children = sln_mix(p, m);
		if (rand_bool())
		{
			children = [sln_copy(p), sln_copy(m)];
			sln_mutate(children[0]);
			sln_mutate(children[1]);
		}
		else
		{
			children = sln_mix(p, m);
		}
		slns[dead.start + i] = children[0];
		slns[dead.start + i + 1] = children[1];
	}
	for (var i = reset.start; i < reset.end; ++i)
	{
		slns[i] = sln_random();
	}
	return improved;
}

window.onload = function() {

	init_links()
	link_rooms("Living", "Bedroom");
	link_rooms("Bathroom", "Kitchen");
	link_rooms("Kitchen", "Living");
	link_rooms("Closet", "Bedroom");

	var slns = population_random();
	var time_since_last_improvement = 0;
	var id = setInterval(function(){
		var improved = false;
		for (var i = 0; i < 200; ++i) {
			if (population_update(slns))
				improved = true;
		}
		if (!improved)
			time_since_last_improvement += 200;
		else
			time_since_last_improvement = 0;
		if (time_since_last_improvement > 8000)
		{
			console.log(sln_evaluate(slns[0], true));
			clearInterval(id);
		}

	}, 200);

};
