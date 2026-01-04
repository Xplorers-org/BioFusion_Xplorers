import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from sklearn.linear_model import Ridge, Lasso, ElasticNet
from sklearn.svm import SVR
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.feature_selection import SelectKBest, f_regression, RFE
import xgboost as xgb
import lightgbm as lgb
import warnings
warnings.filterwarnings('ignore')

# Set style for plots
sns.set_style("whitegrid")
sns.set_palette("husl")

class ParkinsonsUPDRSPredictor:
    
    
    def __init__(self, data_path):
        """Initialize the predictor with dataset path."""
        self.data_path = data_path
        self.data = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.scaler = None
        self.models = {}
        self.results = {}
        
    def load_and_explore_data(self):
        """Load the dataset and perform exploratory data analysis."""
        print("=" * 60)
        print("LOADING AND EXPLORING PARKINSON'S UPDRS DATASET")
        print("=" * 60)
        
        # Load data
        self.data = pd.read_csv(self.data_path)
        print(f"Dataset shape: {self.data.shape}")
        print(f"Total samples: {len(self.data)}")
        
        # Basic info
        print("\nDataset Info:")
        print(self.data.info())
        
        # Check for missing values
        print(f"\nMissing values:\n{self.data.isnull().sum()}")
        
        # Basic statistics
        print(f"\nBasic Statistics:")
        print(self.data.describe())
        
        # Target variable distribution
        print(f"\nTarget Variable (motor_UPDRS) Statistics:")
        print(f"Mean: {self.data['motor_UPDRS'].mean():.2f}")
        print(f"Std: {self.data['motor_UPDRS'].std():.2f}")
        print(f"Min: {self.data['motor_UPDRS'].min():.2f}")
        print(f"Max: {self.data['motor_UPDRS'].max():.2f}")
        
        # Number of unique subjects
        print(f"\nUnique subjects: {self.data['subject#'].nunique()}")
        print(f"Recordings per subject: {len(self.data) / self.data['subject#'].nunique():.1f}")
        
        return self.data
    
    def visualize_data(self):
        """Create visualizations to understand the data better."""
        print("\n" + "=" * 60)
        print("CREATING DATA VISUALIZATIONS")
        print("=" * 60)
        
        # Create figure with subplots
        fig = plt.figure(figsize=(20, 15))
        
        # 1. Distribution of target variable
        plt.subplot(3, 4, 1)
        plt.hist(self.data['motor_UPDRS'], bins=30, alpha=0.7, color='skyblue', edgecolor='black')
        plt.title('Distribution of Motor UPDRS Scores')
        plt.xlabel('Motor UPDRS')
        plt.ylabel('Frequency')
        
        # 2. Age distribution
        plt.subplot(3, 4, 2)
        plt.hist(self.data['age'], bins=20, alpha=0.7, color='lightgreen', edgecolor='black')
        plt.title('Age Distribution')
        plt.xlabel('Age')
        plt.ylabel('Frequency')
        
        # 3. Gender distribution
        plt.subplot(3, 4, 3)
        gender_counts = self.data['sex'].value_counts()
        plt.pie(gender_counts.values, labels=['Male', 'Female'], autopct='%1.1f%%')
        plt.title('Gender Distribution')
        
        # 4. Motor UPDRS vs Age
        plt.subplot(3, 4, 4)
        plt.scatter(self.data['age'], self.data['motor_UPDRS'], alpha=0.5)
        plt.xlabel('Age')
        plt.ylabel('Motor UPDRS')
        plt.title('Motor UPDRS vs Age')
        
        # 5. Motor UPDRS vs Test Time
        plt.subplot(3, 4, 5)
        plt.scatter(self.data['test_time'], self.data['motor_UPDRS'], alpha=0.5)
        plt.xlabel('Test Time')
        plt.ylabel('Motor UPDRS')
        plt.title('Motor UPDRS vs Test Time')
        
        # 6. Correlation heatmap for voice features
        voice_features = [col for col in self.data.columns if 'Jitter' in col or 'Shimmer' in col 
                         or col in ['NHR', 'HNR', 'RPDE', 'DFA', 'PPE']]
        plt.subplot(3, 4, 6)
        correlation_matrix = self.data[voice_features + ['motor_UPDRS']].corr()
        sns.heatmap(correlation_matrix, annot=False, cmap='coolwarm', center=0)
        plt.title('Voice Features Correlation')
        
        # 7. Extended correlation plot
        plt.subplot(3, 4, 7)
        # Show top correlations with target
        correlations = correlation_matrix['motor_UPDRS'].abs().sort_values(ascending=False)[1:8]
        plt.barh(range(len(correlations)), correlations.values)
        plt.yticks(range(len(correlations)), correlations.index)
        plt.xlabel('Absolute Correlation')
        plt.title('Top Voice Feature Correlations')
        
        # 8. Age vs Motor UPDRS by gender
        plt.subplot(3, 4, 8)
        males = self.data[self.data['sex'] == 0]
        females = self.data[self.data['sex'] == 1]
        plt.scatter(males['age'], males['motor_UPDRS'], alpha=0.5, label='Male')
        plt.scatter(females['age'], females['motor_UPDRS'], alpha=0.5, label='Female')
        plt.xlabel('Age')
        plt.ylabel('Motor UPDRS')
        plt.title('Motor UPDRS vs Age by Gender')
        plt.legend()
        
        # 9. Box plot: Motor UPDRS by Gender
        plt.subplot(3, 4, 9)
        self.data.boxplot(column='motor_UPDRS', by='sex', ax=plt.gca())
        plt.title('Motor UPDRS by Gender')
        plt.suptitle('')  # Remove default title
        
        # 10. Feature importance preview (using correlation with target)
        plt.subplot(3, 4, 10)
        feature_cols = [col for col in self.data.columns if col not in ['subject#', 'motor_UPDRS', 'total_UPDRS']]
        correlations = self.data[feature_cols + ['motor_UPDRS']].corr()['motor_UPDRS'].abs().sort_values(ascending=False)
        top_10_corr = correlations[1:11]  # Exclude self-correlation
        plt.barh(range(len(top_10_corr)), top_10_corr.values)
        plt.yticks(range(len(top_10_corr)), top_10_corr.index)
        plt.xlabel('Absolute Correlation with Motor UPDRS')
        plt.title('Top 10 Feature Correlations')
        plt.tight_layout()
        
        # 11. Motor UPDRS over time for first few subjects
        plt.subplot(3, 4, 11)
        subjects_to_plot = self.data['subject#'].unique()[:5]
        for subject in subjects_to_plot:
            subject_data = self.data[self.data['subject#'] == subject]
            plt.plot(subject_data['test_time'], subject_data['motor_UPDRS'], 
                    marker='o', label=f'Subject {subject}', alpha=0.7)
        plt.xlabel('Test Time')
        plt.ylabel('Motor UPDRS')
        plt.title('Motor UPDRS Progression (First 5 Subjects)')
        plt.legend()
        
        # 12. Distribution of voice features (sample)
        plt.subplot(3, 4, 12)
        sample_features = ['Jitter(%)', 'Shimmer', 'NHR', 'HNR']
        for i, feature in enumerate(sample_features):
            plt.hist(self.data[feature], bins=20, alpha=0.5, label=feature)
        plt.xlabel('Feature Values')
        plt.ylabel('Frequency')
        plt.title('Distribution of Sample Voice Features')
        plt.legend()
        
        plt.tight_layout()
        plt.savefig('/Users/akilafernando/Documents/TensorForge_Model/data_exploration.png', 
                   dpi=300, bbox_inches='tight')
        plt.show()
        
        print("Data visualizations saved as 'data_exploration.png'")
    
    def prepare_features(self):
        """Prepare features for machine learning."""
        print("\n" + "=" * 60)
        print("PREPARING FEATURES FOR MACHINE LEARNING")
        print("=" * 60)
        
        # Define feature columns (exclude target and ID columns)
        feature_cols = [col for col in self.data.columns 
                       if col not in ['subject#', 'motor_UPDRS', 'total_UPDRS']]
        
        print(f"Feature columns ({len(feature_cols)}):")
        for i, col in enumerate(feature_cols, 1):
            print(f"{i:2d}. {col}")
        
        # Prepare features and target
        X = self.data[feature_cols].copy()
        y = self.data['motor_UPDRS'].copy()
        
        print(f"\nFeature matrix shape: {X.shape}")
        print(f"Target vector shape: {y.shape}")
        
        # Split the data
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=None
        )
        
        print(f"Training set size: {self.X_train.shape[0]}")
        print(f"Test set size: {self.X_test.shape[0]}")
        
        # Scale features
        self.scaler = RobustScaler()  # More robust to outliers than StandardScaler
        self.X_train_scaled = self.scaler.fit_transform(self.X_train)
        self.X_test_scaled = self.scaler.transform(self.X_test)
        
        print("Features scaled using RobustScaler")
        
        return self.X_train, self.X_test, self.y_train, self.y_test
    
    def feature_selection(self):
        """Perform feature selection to identify most important features."""
        print("\n" + "=" * 60)
        print("PERFORMING FEATURE SELECTION")
        print("=" * 60)
        
        # Method 1: Statistical feature selection
        selector = SelectKBest(score_func=f_regression, k=15)
        X_train_selected = selector.fit_transform(self.X_train_scaled, self.y_train)
        
        # Get selected feature names
        feature_names = self.X_train.columns
        selected_features = feature_names[selector.get_support()]
        
        print(f"Top 15 features selected by statistical method:")
        for i, feature in enumerate(selected_features, 1):
            score = selector.scores_[selector.get_support()][i-1]
            print(f"{i:2d}. {feature:<20} (Score: {score:.2f})")
        
        # Method 2: Random Forest feature importance
        rf = RandomForestRegressor(n_estimators=100, random_state=42)
        rf.fit(self.X_train_scaled, self.y_train)
        
        feature_importance = pd.DataFrame({
            'feature': feature_names,
            'importance': rf.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print(f"\nTop 15 features by Random Forest importance:")
        for i, (_, row) in enumerate(feature_importance.head(15).iterrows(), 1):
            print(f"{i:2d}. {row['feature']:<20} (Importance: {row['importance']:.4f})")
        
        # Visualize feature importance
        plt.figure(figsize=(12, 8))
        top_features = feature_importance.head(15)
        plt.barh(range(len(top_features)), top_features['importance'])
        plt.yticks(range(len(top_features)), top_features['feature'])
        plt.xlabel('Feature Importance')
        plt.title('Top 15 Feature Importance (Random Forest)')
        plt.gca().invert_yaxis()
        plt.tight_layout()
        plt.savefig('/Users/akilafernando/Documents/TensorForge_Model/feature_importance.png', 
                   dpi=300, bbox_inches='tight')
        plt.show()
        
        return selected_features, feature_importance
    
    def train_models(self):
        """Train multiple machine learning models."""
        print("\n" + "=" * 60)
        print("TRAINING MACHINE LEARNING MODELS")
        print("=" * 60)
        
        # Define models to train
        models_to_train = {
            'Ridge Regression': Ridge(random_state=42),
            'Lasso Regression': Lasso(random_state=42),
            'ElasticNet': ElasticNet(random_state=42),
            'Random Forest': RandomForestRegressor(random_state=42),
            'Gradient Boosting': GradientBoostingRegressor(random_state=42),
            'SVR': SVR(),
            'XGBoost': xgb.XGBRegressor(random_state=42),
            'LightGBM': lgb.LGBMRegressor(random_state=42, verbose=-1)
        }
        
        # Train and evaluate each model
        for name, model in models_to_train.items():
            print(f"\nTraining {name}...")
            
            # Cross-validation
            cv_scores = cross_val_score(model, self.X_train_scaled, self.y_train, 
                                      cv=5, scoring='neg_mean_squared_error')
            cv_rmse = np.sqrt(-cv_scores)
            
            # Fit model
            model.fit(self.X_train_scaled, self.y_train)
            
            # Predictions
            train_pred = model.predict(self.X_train_scaled)
            test_pred = model.predict(self.X_test_scaled)
            
            # Metrics
            train_rmse = np.sqrt(mean_squared_error(self.y_train, train_pred))
            test_rmse = np.sqrt(mean_squared_error(self.y_test, test_pred))
            train_mae = mean_absolute_error(self.y_train, train_pred)
            test_mae = mean_absolute_error(self.y_test, test_pred)
            train_r2 = r2_score(self.y_train, train_pred)
            test_r2 = r2_score(self.y_test, test_pred)
            
            # Store results
            self.models[name] = model
            self.results[name] = {
                'cv_rmse_mean': cv_rmse.mean(),
                'cv_rmse_std': cv_rmse.std(),
                'train_rmse': train_rmse,
                'test_rmse': test_rmse,
                'train_mae': train_mae,
                'test_mae': test_mae,
                'train_r2': train_r2,
                'test_r2': test_r2,
                'predictions': test_pred
            }
            
            print(f"CV RMSE: {cv_rmse.mean():.3f} ± {cv_rmse.std():.3f}")
            print(f"Test RMSE: {test_rmse:.3f}")
            print(f"Test MAE: {test_mae:.3f}")
            print(f"Test R²: {test_r2:.3f}")
    
    def optimize_best_models(self):
        """Optimize hyperparameters for the best performing models."""
        print("\n" + "=" * 60)
        print("OPTIMIZING HYPERPARAMETERS FOR BEST MODELS")
        print("=" * 60)
        
        # Find top 3 models based on test RMSE
        sorted_models = sorted(self.results.items(), 
                             key=lambda x: x[1]['test_rmse'])[:3]
        
        print("Top 3 models for optimization:")
        for i, (name, metrics) in enumerate(sorted_models, 1):
            print(f"{i}. {name} - Test RMSE: {metrics['test_rmse']:.3f}")
        
        optimized_models = {}
        
        for name, _ in sorted_models:
            print(f"\nOptimizing {name}...")
            
            if name == 'Random Forest':
                param_grid = {
                    'n_estimators': [100, 200, 300],
                    'max_depth': [10, 20, None],
                    'min_samples_split': [2, 5, 10],
                    'min_samples_leaf': [1, 2, 4]
                }
                model = RandomForestRegressor(random_state=42)
                
            elif name == 'XGBoost':
                param_grid = {
                    'n_estimators': [100, 200, 300],
                    'max_depth': [3, 6, 9],
                    'learning_rate': [0.01, 0.1, 0.2],
                    'subsample': [0.8, 0.9, 1.0]
                }
                model = xgb.XGBRegressor(random_state=42)
                
            elif name == 'LightGBM':
                param_grid = {
                    'n_estimators': [100, 200, 300],
                    'max_depth': [5, 10, 15],
                    'learning_rate': [0.01, 0.1, 0.2],
                    'num_leaves': [31, 50, 100]
                }
                model = lgb.LGBMRegressor(random_state=42, verbose=-1)
                
            elif name == 'Gradient Boosting':
                param_grid = {
                    'n_estimators': [100, 200, 300],
                    'max_depth': [3, 5, 7],
                    'learning_rate': [0.01, 0.1, 0.2],
                    'subsample': [0.8, 0.9, 1.0]
                }
                model = GradientBoostingRegressor(random_state=42)
            else:
                continue  # Skip models we don't have param grids for
            
            # Grid search with cross-validation
            grid_search = GridSearchCV(
                model, param_grid, cv=5, scoring='neg_mean_squared_error',
                n_jobs=-1, verbose=1
            )
            
            grid_search.fit(self.X_train_scaled, self.y_train)
            
            # Get best model
            best_model = grid_search.best_estimator_
            
            # Evaluate optimized model
            train_pred = best_model.predict(self.X_train_scaled)
            test_pred = best_model.predict(self.X_test_scaled)
            
            test_rmse = np.sqrt(mean_squared_error(self.y_test, test_pred))
            test_mae = mean_absolute_error(self.y_test, test_pred)
            test_r2 = r2_score(self.y_test, test_pred)
            
            optimized_models[f"{name}_Optimized"] = {
                'model': best_model,
                'best_params': grid_search.best_params_,
                'test_rmse': test_rmse,
                'test_mae': test_mae,
                'test_r2': test_r2,
                'predictions': test_pred
            }
            
            print(f"Best parameters: {grid_search.best_params_}")
            print(f"Optimized Test RMSE: {test_rmse:.3f}")
            print(f"Improvement: {self.results[name]['test_rmse'] - test_rmse:.3f}")
        
        return optimized_models
    
    def create_ensemble_model(self, optimized_models):
        """Create an ensemble model from the best performing models."""
        print("\n" + "=" * 60)
        print("CREATING ENSEMBLE MODEL")
        print("=" * 60)
        
        # Select top models for ensemble
        top_models = []
        model_names = []
        
        for name, model_info in optimized_models.items():
            top_models.append((name, model_info['model']))
            model_names.append(name)
        
        # Create voting regressor
        ensemble = VotingRegressor(top_models)
        ensemble.fit(self.X_train_scaled, self.y_train)
        
        # Evaluate ensemble
        train_pred = ensemble.predict(self.X_train_scaled)
        test_pred = ensemble.predict(self.X_test_scaled)
        
        test_rmse = np.sqrt(mean_squared_error(self.y_test, test_pred))
        test_mae = mean_absolute_error(self.y_test, test_pred)
        test_r2 = r2_score(self.y_test, test_pred)
        
        print(f"Ensemble Model Performance:")
        print(f"Test RMSE: {test_rmse:.3f}")
        print(f"Test MAE: {test_mae:.3f}")
        print(f"Test R²: {test_r2:.3f}")
        
        return ensemble, test_pred
    
    def evaluate_and_visualize_results(self, optimized_models, ensemble, ensemble_pred):
        """Create comprehensive evaluation and visualizations."""
        print("\n" + "=" * 60)
        print("FINAL MODEL EVALUATION AND VISUALIZATION")
        print("=" * 60)
        
        # Compile all results
        all_results = {}
        
        # Original models
        for name, metrics in self.results.items():
            all_results[name] = metrics
        
        # Optimized models
        for name, model_info in optimized_models.items():
            all_results[name] = {
                'test_rmse': model_info['test_rmse'],
                'test_mae': model_info['test_mae'],
                'test_r2': model_info['test_r2'],
                'predictions': model_info['predictions']
            }
        
        # Ensemble model
        ensemble_rmse = np.sqrt(mean_squared_error(self.y_test, ensemble_pred))
        ensemble_mae = mean_absolute_error(self.y_test, ensemble_pred)
        ensemble_r2 = r2_score(self.y_test, ensemble_pred)
        
        all_results['Ensemble'] = {
            'test_rmse': ensemble_rmse,
            'test_mae': ensemble_mae,
            'test_r2': ensemble_r2,
            'predictions': ensemble_pred
        }
        
        # Create results summary
        results_df = pd.DataFrame({
            name: [metrics['test_rmse'], metrics['test_mae'], metrics['test_r2']]
            for name, metrics in all_results.items()
        }, index=['RMSE', 'MAE', 'R²']).T
        
        results_df = results_df.sort_values('RMSE')
        print("\nModel Performance Summary (Test Set):")
        print(results_df.round(4))
        
        # Save results
        results_df.to_csv('/Users/akilafernando/Documents/TensorForge_Model/model_results.csv')
        
        # Create comprehensive visualizations
        fig = plt.figure(figsize=(20, 12))
        
        # 1. Model comparison bar plot
        plt.subplot(2, 4, 1)
        models_to_plot = results_df.head(8)  # Top 8 models
        plt.bar(range(len(models_to_plot)), models_to_plot['RMSE'])
        plt.xticks(range(len(models_to_plot)), models_to_plot.index, rotation=45, ha='right')
        plt.ylabel('RMSE')
        plt.title('Model Performance Comparison')
        
        # 2. Predicted vs Actual for best model
        best_model_name = results_df.index[0]
        best_predictions = all_results[best_model_name]['predictions']
        
        plt.subplot(2, 4, 2)
        plt.scatter(self.y_test, best_predictions, alpha=0.6)
        plt.plot([self.y_test.min(), self.y_test.max()], 
                [self.y_test.min(), self.y_test.max()], 'r--', lw=2)
        plt.xlabel('Actual Motor UPDRS')
        plt.ylabel('Predicted Motor UPDRS')
        plt.title(f'Predicted vs Actual ({best_model_name})')
        
        # 3. Residual plot for best model
        plt.subplot(2, 4, 3)
        residuals = self.y_test - best_predictions
        plt.scatter(best_predictions, residuals, alpha=0.6)
        plt.axhline(y=0, color='r', linestyle='--')
        plt.xlabel('Predicted Motor UPDRS')
        plt.ylabel('Residuals')
        plt.title(f'Residual Plot ({best_model_name})')
        
        # 4. Error distribution
        plt.subplot(2, 4, 4)
        plt.hist(residuals, bins=30, alpha=0.7, color='skyblue', edgecolor='black')
        plt.xlabel('Residuals')
        plt.ylabel('Frequency')
        plt.title('Error Distribution')
        
        # 5. Ensemble vs Best Individual Model
        plt.subplot(2, 4, 5)
        plt.scatter(self.y_test, ensemble_pred, alpha=0.6, label='Ensemble')
        plt.scatter(self.y_test, best_predictions, alpha=0.6, label=best_model_name)
        plt.plot([self.y_test.min(), self.y_test.max()], 
                [self.y_test.min(), self.y_test.max()], 'r--', lw=2)
        plt.xlabel('Actual Motor UPDRS')
        plt.ylabel('Predicted Motor UPDRS')
        plt.title('Ensemble vs Best Individual Model')
        plt.legend()
        
        # 6. Model performance metrics comparison
        plt.subplot(2, 4, 6)
        top_5_models = results_df.head(5)
        x = np.arange(len(top_5_models))
        width = 0.25
        
        plt.bar(x - width, top_5_models['RMSE'], width, label='RMSE', alpha=0.8)
        plt.bar(x, top_5_models['MAE'], width, label='MAE', alpha=0.8)
        plt.bar(x + width, top_5_models['R²'], width, label='R²', alpha=0.8)
        
        plt.xlabel('Models')
        plt.ylabel('Metric Value')
        plt.title('Performance Metrics Comparison')
        plt.xticks(x, top_5_models.index, rotation=45, ha='right')
        plt.legend()
        
        # 7. Prediction accuracy by UPDRS score range
        plt.subplot(2, 4, 7)
        score_ranges = ['Low (0-20)', 'Medium (20-40)', 'High (40+)']
        range_accuracy = []
        
        for i, (low, high) in enumerate([(0, 20), (20, 40), (40, 100)]):
            mask = (self.y_test >= low) & (self.y_test < high)
            if mask.sum() > 0:
                range_rmse = np.sqrt(mean_squared_error(self.y_test[mask], best_predictions[mask]))
                range_accuracy.append(range_rmse)
            else:
                range_accuracy.append(0)
        
        plt.bar(score_ranges, range_accuracy)
        plt.ylabel('RMSE')
        plt.title('Prediction Accuracy by Score Range')
        plt.xticks(rotation=45)
        
        # 8. Learning curve (if available)
        plt.subplot(2, 4, 8)
        if hasattr(self.models.get('Random Forest', None), 'estimators_'):
            # Simulate learning curve for Random Forest
            train_sizes = [0.1, 0.3, 0.5, 0.7, 0.9, 1.0]
            train_errors = []
            val_errors = []
            
            for size in train_sizes:
                n_samples = int(size * len(self.X_train_scaled))
                X_subset = self.X_train_scaled[:n_samples]
                y_subset = self.y_train.iloc[:n_samples]
                
                model = RandomForestRegressor(n_estimators=100, random_state=42)
                model.fit(X_subset, y_subset)
                
                train_pred = model.predict(X_subset)
                val_pred = model.predict(self.X_test_scaled)
                
                train_errors.append(np.sqrt(mean_squared_error(y_subset, train_pred)))
                val_errors.append(np.sqrt(mean_squared_error(self.y_test, val_pred)))
            
            plt.plot([s * len(self.X_train_scaled) for s in train_sizes], 
                    train_errors, 'o-', label='Training Error')
            plt.plot([s * len(self.X_train_scaled) for s in train_sizes], 
                    val_errors, 'o-', label='Validation Error')
            plt.xlabel('Training Set Size')
            plt.ylabel('RMSE')
            plt.title('Learning Curve')
            plt.legend()
        
        plt.tight_layout()
        plt.savefig('/Users/akilafernando/Documents/TensorForge_Model/model_evaluation.png', 
                   dpi=300, bbox_inches='tight')
        plt.show()
        
        # Print final summary
        print(f"\n BEST MODEL: {best_model_name}")
        print(f"   Test RMSE: {results_df.loc[best_model_name, 'RMSE']:.3f}")
        print(f"   Test MAE:  {results_df.loc[best_model_name, 'MAE']:.3f}")
        print(f"   Test R²:   {results_df.loc[best_model_name, 'R²']:.3f}")
        
        print(f"\n ENSEMBLE MODEL:")
        print(f"   Test RMSE: {ensemble_rmse:.3f}")
        print(f"   Test MAE:  {ensemble_mae:.3f}")
        print(f"   Test R²:   {ensemble_r2:.3f}")
        
        return results_df, best_model_name
    
    def save_best_model(self, optimized_models, ensemble, best_model_name):
        """Save the best performing model for future use."""
        import joblib
        
        print("\n" + "=" * 60)
        print("SAVING BEST MODEL")
        print("=" * 60)
        
        # Save the scaler
        joblib.dump(self.scaler, '/Users/akilafernando/Documents/TensorForge_Model/scaler.pkl')
        
        # Save the best individual model
        if best_model_name in optimized_models:
            best_model = optimized_models[best_model_name]['model']
        elif best_model_name in self.models:
            best_model = self.models[best_model_name]
        else:
            # If best model is ensemble, save the first optimized model
            best_model = list(optimized_models.values())[0]['model']
        
        joblib.dump(best_model, '/Users/akilafernando/Documents/TensorForge_Model/best_model.pkl')
        
        # Save the ensemble model
        joblib.dump(ensemble, '/Users/akilafernando/Documents/TensorForge_Model/ensemble_model.pkl')
        
        # Save feature names
        feature_names = list(self.X_train.columns)
        joblib.dump(feature_names, '/Users/akilafernando/Documents/TensorForge_Model/feature_names.pkl')
        
        print(f"Saved models and preprocessing objects:")
        print(f"   - Best model ({best_model_name}): best_model.pkl")
        print(f"   - Ensemble model: ensemble_model.pkl")
        print(f"   - Feature scaler: scaler.pkl")
        print(f"   - Feature names: feature_names.pkl")
        
        # Create a prediction function for easy use
        prediction_code = '''
import joblib
import pandas as pd
import numpy as np

def predict_motor_updrs(features_dict):
    """
    Predict motor UPDRS score from voice features and patient data.
    
    Parameters:
    features_dict: dict with keys matching the feature names
    
    Returns:
    predicted_motor_updrs: float
    """
    # Load saved objects
    scaler = joblib.load('scaler.pkl')
    model = joblib.load('best_model.pkl')
    feature_names = joblib.load('feature_names.pkl')
    
    # Create feature array in correct order
    features = [features_dict[name] for name in feature_names]
    features = np.array(features).reshape(1, -1)
    
    # Scale features
    features_scaled = scaler.transform(features)
    
    # Make prediction
    prediction = model.predict(features_scaled)[0]
    
    return prediction

# Example usage:
# prediction = predict_motor_updrs({
#     'age': 72, 'sex': 0, 'test_time': 5.6431,
#     'Jitter(%)': 0.00662, 'Jitter(Abs)': 3.38e-005,
#     # ... include all other features
# })
'''
        
        with open('/Users/akilafernando/Documents/TensorForge_Model/predict_updrs.py', 'w') as f:
            f.write(prediction_code)
        
        print(f"   - Prediction function: predict_updrs.py")
    
    def run_complete_pipeline(self):
        """Run the complete machine learning pipeline."""
        print("🚀 STARTING PARKINSON'S DISEASE UPDRS PREDICTION PIPELINE")
        print("=" * 80)
        
        # Step 1: Load and explore data
        self.load_and_explore_data()
        
        # Step 2: Visualize data
        self.visualize_data()
        
        # Step 3: Prepare features
        self.prepare_features()
        
        # Step 4: Feature selection
        selected_features, feature_importance = self.feature_selection()
        
        # Step 5: Train models
        self.train_models()
        
        # Step 6: Optimize best models
        optimized_models = self.optimize_best_models()
        
        # Step 7: Create ensemble
        ensemble, ensemble_pred = self.create_ensemble_model(optimized_models)
        
        # Step 8: Evaluate and visualize
        results_df, best_model_name = self.evaluate_and_visualize_results(
            optimized_models, ensemble, ensemble_pred
        )
        
        # Step 9: Save best model
        self.save_best_model(optimized_models, ensemble, best_model_name)
        
        print("\n" + "=" * 80)
        print("🎉 PIPELINE COMPLETED SUCCESSFULLY!")
        print("=" * 80)
        
        return results_df, best_model_name, optimized_models, ensemble

def main():
    """Main function to run the complete pipeline."""
    # Initialize the predictor
    predictor = ParkinsonsUPDRSPredictor('/Users/akilafernando/Documents/TensorForge_Model/parkinsons_updrs.csv')
    
    # Run the complete pipeline
    results, best_model, optimized_models, ensemble = predictor.run_complete_pipeline()
    
    return predictor, results, best_model, optimized_models, ensemble

if __name__ == "__main__":
    predictor, results, best_model, optimized_models, ensemble = main()