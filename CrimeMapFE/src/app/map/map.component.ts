import { Component, OnInit, ViewChild } from '@angular/core';

import { MapService } from '../map.service';
import 'leaflet/dist/images/marker-shadow.png';
/// <reference types='leaflet-sidebar-v2' />
import { geoJSON, SidebarOptions, Map, Control, control } from 'leaflet';
import { NgxSidebarControlComponent } from '@runette/ngx-leaflet-sidebar';

import 'leaflet-sidebar-v2';
declare var HeatmapOverlay;
declare var L;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  //Create map, sidebar
  public map: Map;
  public sidebarOptions: SidebarOptions = {
    position: 'right',
    autopan: false,
    closeButton: false,
    container: 'sidebar',
  };
  @ViewChild(NgxSidebarControlComponent, { static: false }) sidebar: NgxSidebarControlComponent;

  //Info panel for municipality
  private panelContent: Control.PanelOptions = {
    id: 'text',
    tab: '<i class="fas fa-info-circle" title="text">description</i>',
    position: 'top',
    title: 'Kriminal u opštini',
    pane: ''
  };

  //Create heatmap layer, opstineLayer, openstreet
  heatmapLayer = new HeatmapOverlay({
    radius: 0.014,
    maxOpacity: 0.5,
    scaleRadius: true,
    useLocalExtrema: true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count',
    gradient: {
      0.1: '#41FF61',
      0.2: '#46F739',
      0.3: '#6CF030',
      0.4: '#93E928',
      0.5: '#BAE220',
      0.6: '#DBD419',
      0.7: '#D49E12',
      0.8: '#CD690B',
      0.9: '#C63405',
      1.0: '#BF0000',
    }
  });
  openStreetMap = L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    {
      maxZoom: 16,
      minZoom: 10,
      maxBounds: [
        //south west
        [43.5704, 18.9465],
        //north east
        [44.1407, 17.8751]
      ],
    }
  );
  private opstineLayer = geoJSON();
  private dataOpstine;

  //Map creation options
  options = {
    layers: [
      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 15,
        minZoom: 10,
        detectRetina: true,
        attribution: 'CrimeMap Kanton Sarajevo',
      }),
      this.heatmapLayer
    ],
    zoom: 11,
    center: L.latLng([43.85085959999998, 18.3694409]),
    attributionControl: false,
    maxBounds: [
      //south west
      [43.5704, 18.9465],
      //north east
      [44.1407, 17.8751]
    ],
  };

  //Map layers start options
  layersControl = {
    baseLayers: {
      'Open Street Map': this.openStreetMap
    },
    overlays: {
      'Heatmapa kriminala po naselju': this.heatmapLayer,
      'Kriminal u opstinama': this.opstineLayer,
    }
  };

  allOverlays = [this.openStreetMap, this.heatmapLayer, this.opstineLayer];


  //Init mapService
  constructor(
    private mapService: MapService
  ) { }

  //getCrimes Naselja
  getCrimeNaselja() {
    const data = {
      data: []
    };
    this.mapService.crimeDataNaselja().subscribe(
      result => {
        data.data = (this.geoJson2heat(result));
        this.heatmapLayer.setData(data);
      });
  }

  //getCrimes municipality, setting different options for layers
  getCrimeOpstina() {
    this.mapService.crimeDataOpstine().subscribe(
      (result: any) => {
        this.dataOpstine = result;
        this.initStatesLayer();
      });
  }
  private initStatesLayer() {
    const opstLayer = L.geoJSON(this.dataOpstine, {
      style: (feature) => ({
        weight: 2,
        opacity: 0.4,
        color: 'grey',
        fillOpacity: 0.3,
        fillColor: '#202020'

      }),
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => (this.highlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e)),
          click: (e) => (this.infoTooltip(e, layer))
        })
      )
    }).bindTooltip(function (layer) {
      return (`${layer.feature.properties.name}`);
    },
      {
        sticky: true
      });

    this.opstineLayer.addLayer(opstLayer);
  }

  private highlightFeature = e => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      opacity: 0.4,
      color: '#DFA612',
      fillOpacity: 0.3,
      fillColor: '#FAE042',
    });
  }
  private resetFeature = e => {
    const layer = e.target;
    layer.setStyle({
      weight: 3,
      opacity: 0.4,
      color: 'grey',
      fillOpacity: 0.3,
      fillColor: '#202020'
    });
  }
  private infoTooltip = (e, mapLayer: any) => {
    const layer = e.target;
    const sidebar = this.sidebar.sidebar;
    sidebar.removePanel('text');
    let list = layer.feature.properties.brDjela;
    console.log(list)

    const title = 'Kriminal u opštini';
    const panelHtml = `<h1>${layer.feature.properties.name}</h1>
      <p>Broj kriminalnih dijela: ${layer.feature.properties.kriminalitet}</p>`;
    this.panelContent.pane = panelHtml;
    sidebar.addPanel(this.panelContent);
    sidebar.open('text');
  }

  //Starting map
  onMapReady(map: Map) {
    this.map = map;
    this.legendControl(map);
    this.getCrimeNaselja();
    this.getCrimeOpstina();
    this.map.addControl(
      control.attribution({
        position: 'bottomleft',
        prefix: ''
      })
    );

  }

  //Setting location of map layers
  legendControl(map: Map) {
    const lc = L.control.layers(this.layersControl.baseLayers, this.layersControl.overlays, {
      position: 'topright',
      collapsed: false
    }).addTo(map);
    const htmlObject = lc.getContainer();
    const a = document.getElementById('layercontrol');
    function setParent(el, newParent) {
      newParent.appendChild(el);
    }
    setParent(htmlObject, a);
  }

  //Conversion of geoJson
  geoJson2heat(geojson) {
    return geojson.features.map((feature) => {
      return {
        lat: parseFloat(feature.geometry.coordinates[1]),
        lng: parseFloat(feature.geometry.coordinates[0]),
        count: (feature.properties.kriminalitet)
      };
    });
  }
}
