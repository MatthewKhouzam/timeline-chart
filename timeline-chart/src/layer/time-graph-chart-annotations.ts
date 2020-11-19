import { TimeGraphAnnotationCoordinates } from "../components/time-graph-annotation";
import { TimeGraphAnnotationComponent } from "../components/time-graph-annotation";
import { TimeGraphElementPosition } from "../components/time-graph-component";
import { TimelineChart } from "../time-graph-model";
import { TimeGraphChartLayer } from "./time-graph-chart-layer";

export class TimeGraphChartAnnotations extends TimeGraphChartLayer {

    protected annotations: Map<TimelineChart.TimeGraphAnnotation, TimeGraphAnnotationComponent>;

    protected afterAddToContainer() {
        this.unitController.onViewRangeChanged(() => this.update());

        this.rowController.onVerticalOffsetChangedHandler(verticalOffset => {
            this.layer.position.y = -verticalOffset;
        });
    }

    protected getCoordinates(annotation: TimelineChart.TimeGraphAnnotation): TimeGraphAnnotationCoordinates {
        const relativeStartPosition = annotation.range.start - this.unitController.viewRange.start;
        const start: TimeGraphElementPosition = {
            x: this.getPixels(relativeStartPosition),
            y: (this.rowController.rowHeight / 2) + (annotation.sourceId * this.rowController.rowHeight)
        }
        const end = start;

        return { start, end, symbol: 'cross', size: this.rowController.rowHeight, color: 0 };
    }

    protected addAnnotation(annotation: TimelineChart.TimeGraphAnnotation) {
        const annotationComponent = new TimeGraphAnnotationComponent(annotation.id, this.getCoordinates(annotation));
        if(!this.annotations){
            this.annotations = new Map();
        }
        this.annotations.set(annotation, annotationComponent);
        this.addChild(annotationComponent);
    }

    addAnnotations(annotations: TimelineChart.TimeGraphAnnotation[]): void {
        if (!this.stateController) {
            throw ('Add this TimeGraphChartAnnotations to a container before adding annotations.');
        }
        annotations.forEach(annotation => {
            this.addAnnotation(annotation);
        })
    }

    update(): void {
        if (this.annotations) {
            for (const annotation of this.annotations.keys()) {
                this.updateAnnotation(annotation);
            }
        }
    }

    protected updateAnnotation(annotation: TimelineChart.TimeGraphAnnotation) {
        const coords = this.getCoordinates(annotation);
        const annotationComponent = this.annotations.get(annotation);
        if (annotationComponent) {
            annotationComponent.update(coords);
        }
    }

}