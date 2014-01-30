var GQ = GQ || {};

//Global list of available datasets
GQ.datasets = [
	{
		name: "UK Administrative Areas",
		description: "For UK geography neds",
		url: "app/data/uk-topo.json",
		label: "uk-administrative-areas",
		objectSet: 'uk',
		nameAttribute: 'NAME_2',
		featureType: 'administrative unit',
		lookAt: { lat: 53, lon: -2, alt: 6 },
		maxZoom: 8
	},
	{
		name: "UK Historical Counties",
		description: "Olde school UK counties, from the olden days",
		url: "app/data/uk-counties-topo.json",
		label: 'uk-historical-counties',
		objectSet: 'uk-counties',
		nameAttribute: 'NAME',
		featureType: 'county',
		lookAt: { lat: 53, lon: -2, alt: 6 },
		maxZoom: 9
	},
	{	
		name: "US States",
		description: "US States!",
		url: "app/data/us-states-topo.json",
		label: 'us-states',
		objectSet: 'us-states',
		nameAttribute: 'name',
		featureType: 'state',
		lookAt: { lat: 50, lon: -120, alt: 2 },
		maxZoom: 5
	},
];