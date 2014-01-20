var GQ = GQ || {};

//Global list of available datasets
GQ.datasets = [
	{
		name: "UK Administrative Areas",
		description: "For UK geography neds",
		url: "app/data/uk-topo.json",
		objectSet: 'uk',
		nameAttribute: 'NAME_2',
		featureType: 'administrative unit',
		mapView: { lat: 53, lon: -2, alt: 6 }
	},
	{
		name: "UK Historical Counties",
		description: "Olde school UK counties, from the olden days",
		url: "app/data/uk-counties-topo.json",
		objectSet: 'uk-counties',
		nameAttribute: 'NAME',
		featureType: 'county',
		mapView: { lat: 53, lon: -2, alt: 6 }
	},
	{	
		name: "US States",
		description: "US States!",
		url: "app/data/us-states-topo.json",
		objectSet: 'us-states',
		nameAttribute: 'name',
		featureType: 'state',
		mapView: { lat: 50, lon: -120, alt: 2 }
	},
];